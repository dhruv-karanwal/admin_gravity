import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  writeBatch,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Member {
  uid: string;
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  goal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general';
  planName: 'Monthly' | 'Quarterly' | 'Half-yearly' | 'Annual';
  planStartDate: number; // millisecondsSinceEpoch
  planEndDate: number;   // millisecondsSinceEpoch
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  pin?: string | null;
}

const USERS_COLLECTION = "users";

// Plan durations in months
const PLAN_DURATION: Record<string, number> = {
  'Monthly': 1,
  'Quarterly': 3,
  'Half-yearly': 6,
  'Annual': 12,
};

// Plan prices in INR
export const PLAN_PRICE: Record<string, number> = {
  'Monthly': 1500,
  'Quarterly': 4000,
  'Half-yearly': 7000,
  'Annual': 12000,
};

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

/** Checks expiry for a single member and marks them inactive if expired. No Cloud Functions needed. */
async function syncMemberStatus(member: Member): Promise<Member> {
  const now = Date.now();
  const shouldBeActive = member.planEndDate > now;
  if (member.isActive !== shouldBeActive) {
    const docRef = doc(db, USERS_COLLECTION, member.uid);
    await updateDoc(docRef, { isActive: shouldBeActive, updatedAt: now });
    return { ...member, isActive: shouldBeActive, updatedAt: now };
  }
  return member;
}

export const getAllMembers = async (): Promise<Member[]> => {
  const q = query(collection(db, USERS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const members = snapshot.docs.map(d => ({ uid: d.id, ...d.data() } as Member));
  // Sync expiry status inline (replaces Cloud Function checkExpirations)
  return Promise.all(members.map(syncMemberStatus));
};

export const getMemberById = async (uid: string): Promise<Member | null> => {
  const docRef = doc(db, USERS_COLLECTION, uid);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const member = { uid: snapshot.id, ...snapshot.data() } as Member;
    return syncMemberStatus(member);
  }
  return null;
};

export const getMemberRealtime = (uid: string, callback: (member: Member | null) => void) => {
  const docRef = doc(db, USERS_COLLECTION, uid);
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ uid: snapshot.id, ...snapshot.data() } as Member);
    } else {
      callback(null);
    }
  });
};

export const getExpiringMembers = async (days: number): Promise<Member[]> => {
  const now = Date.now();
  const future = now + days * 24 * 60 * 60 * 1000;
  const q = query(
    collection(db, USERS_COLLECTION),
    where("isActive", "==", true),
    where("planEndDate", "<=", future),
    where("planEndDate", ">", now),
    orderBy("planEndDate", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ uid: d.id, ...d.data() } as Member));
};

export const getActiveMembersCount = async (): Promise<number> => {
  const now = Date.now();
  const q = query(
    collection(db, USERS_COLLECTION),
    where("isActive", "==", true),
    where("planEndDate", ">", now)
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
};

export const addMember = async (data: {
  name: string;
  phone: string;
  email?: string;
  goal: Member['goal'];
  planName: Member['planName'];
}): Promise<Member> => {
  const now = Date.now();
  const planStart = new Date(now);
  const planEnd = addMonths(planStart, PLAN_DURATION[data.planName] || 1);
  const uid = `user_${data.phone}_${now}`;

  const newMember: Member = {
    uid,
    name: data.name,
    phone: data.phone,
    email: data.email,
    photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
    goal: data.goal,
    planName: data.planName,
    planStartDate: now,
    planEndDate: planEnd.getTime(),
    isActive: true,
    createdAt: now,
    updatedAt: now,
    pin: null,
  };

  await setDoc(doc(db, USERS_COLLECTION, uid), newMember);
  return newMember;
};

export const updateMember = async (uid: string, data: Partial<Member>): Promise<void> => {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(docRef, { ...data, updatedAt: Date.now() });
};

/**
 * Records a payment AND updates member expiry/status atomically.
 * This replaces the Cloud Function `onPaymentCreated`.
 */
export const renewMembership = async (
  uid: string,
  planName: Member['planName'],
  paymentMethod: 'cash' | 'card' | 'upi' | 'transfer' = 'cash'
): Promise<void> => {
  const batch = writeBatch(db);
  const now = Date.now();

  // Get current member to calculate new expiry from current end date
  const memberSnap = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!memberSnap.exists()) throw new Error('Member not found');
  const member = memberSnap.data() as Member;

  // If already expired, start from today; otherwise extend from current expiry
  const baseDate = member.planEndDate < now ? new Date(now) : new Date(member.planEndDate);
  const newEndDate = addMonths(baseDate, PLAN_DURATION[planName] || 1);

  // Update member
  const memberRef = doc(db, USERS_COLLECTION, uid);
  batch.update(memberRef, {
    planName,
    planStartDate: now,
    planEndDate: newEndDate.getTime(),
    isActive: true,
    updatedAt: now,
  });

  // Add payment record
  const paymentRef = doc(collection(db, "payments"));
  batch.set(paymentRef, {
    userId: uid,
    userName: member.name,
    amount: PLAN_PRICE[planName] || 0,
    plan: planName,
    method: paymentMethod,
    status: 'completed',
    createdAt: Timestamp.fromMillis(now),
  });

  // Audit log
  const logRef = doc(collection(db, "audit_logs"));
  batch.set(logRef, {
    action: "membership_renewal",
    userId: uid,
    plan: planName,
    timestamp: serverTimestamp(),
    details: `Renewed via Admin dashboard — new expiry: ${newEndDate.toDateString()}`,
  });

  await batch.commit();
};

export const searchMembers = async (searchQuery: string): Promise<Member[]> => {
  const q = query(
    collection(db, USERS_COLLECTION),
    where("name", ">=", searchQuery),
    where("name", "<=", searchQuery + '\uf8ff'),
    orderBy("name")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ uid: d.id, ...d.data() } as Member));
};

export const deactivateMember = async (uid: string): Promise<void> => {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(docRef, { isActive: false, updatedAt: Date.now() });
};

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
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Member {
  uid: string;
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  fcmToken?: string;
  goal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general';
  planName: 'Monthly' | 'Quarterly' | 'Half-yearly' | 'Annual';
  planStartDate: Timestamp;
  planEndDate: Timestamp;
  isActive: boolean;
  createdAt: Timestamp;
}

const MEMBERS_COLLECTION = "users"; // As specified in rules

export const getAllMembers = async () => {
  const q = query(collection(db, MEMBERS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Member));
};

export const getMemberById = async (uid: string) => {
  const docRef = doc(db, MEMBERS_COLLECTION, uid);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { uid: snapshot.id, ...snapshot.data() } as Member;
  }
  return null;
};

export const getMemberRealtime = (uid: string, callback: (member: Member | null) => void) => {
  const docRef = doc(db, MEMBERS_COLLECTION, uid);
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ uid: snapshot.id, ...snapshot.data() } as Member);
    } else {
      callback(null);
    }
  });
};

export const getExpiringMembers = async (days: number) => {
  const now = new Date();
  const future = new Date();
  future.setDate(now.getDate() + days);

  const q = query(
    collection(db, MEMBERS_COLLECTION),
    where("isActive", "==", true),
    where("planEndDate", "<=", Timestamp.fromDate(future)),
    where("planEndDate", ">", Timestamp.fromDate(now)),
    orderBy("planEndDate", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Member));
};

export const getActiveMembersCount = async () => {
  const q = query(collection(db, MEMBERS_COLLECTION), where("isActive", "==", true));
  const snapshot = await getDocs(q);
  return snapshot.size;
};

export const addMember = async (data: Omit<Member, 'uid' | 'createdAt'>) => {
  const docRef = doc(collection(db, MEMBERS_COLLECTION));
  const newMember = {
    ...data,
    uid: docRef.id,
    createdAt: serverTimestamp()
  };
  await setDoc(docRef, newMember);
  return newMember;
};

export const updateMember = async (uid: string, data: Partial<Member>) => {
  const docRef = doc(db, MEMBERS_COLLECTION, uid);
  await updateDoc(docRef, data);
};

export const renewMembership = async (uid: string, plan: string, endDate: Timestamp, payment: any) => {
  const batch = writeBatch(db);
  
  // Update member
  const memberRef = doc(db, MEMBERS_COLLECTION, uid);
  batch.update(memberRef, {
    planName: plan,
    planEndDate: endDate,
    isActive: true
  });

  // Add payment
  const paymentRef = doc(collection(db, "payments"));
  batch.set(paymentRef, {
    ...payment,
    userId: uid,
    createdAt: serverTimestamp()
  });

  // Audit Log
  const logRef = doc(collection(db, "audit_logs"));
  batch.set(logRef, {
    action: "membership_renewal",
    userId: uid,
    plan: plan,
    timestamp: serverTimestamp(),
    details: "Renewed via Admin dashboard"
  });

  await batch.commit();
};

export const searchMembers = async (searchQuery: string) => {
  // Simple prefix search
  const q = query(
    collection(db, MEMBERS_COLLECTION),
    where("name", ">=", searchQuery),
    where("name", "<=", searchQuery + '\uf8ff'),
    orderBy("name")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Member));
};

export const deactivateMember = async (uid: string) => {
  const docRef = doc(db, MEMBERS_COLLECTION, uid);
  await updateDoc(docRef, { isActive: false });
};

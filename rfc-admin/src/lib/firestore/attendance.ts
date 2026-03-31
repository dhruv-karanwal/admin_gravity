import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp,
  addDoc,
  limit
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  checkInAt: Timestamp;
  status: 'present' | 'absent' | 'late';
  method: 'manual' | 'qr';
}

const ATTENDANCE_COLLECTION = "attendance";

export const getAttendanceToday = async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
        collection(db, ATTENDANCE_COLLECTION),
        where("checkInAt", ">=", Timestamp.fromDate(startOfDay)),
        where("checkInAt", "<=", Timestamp.fromDate(endOfDay)),
        orderBy("checkInAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
};

export const getAttendanceHistory = async (days: number = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
        collection(db, ATTENDANCE_COLLECTION),
        where("checkInAt", ">=", Timestamp.fromDate(startDate)),
        orderBy("checkInAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
};

export const getUserAttendance = async (userId: string, limitCount: number = 30) => {
    const q = query(
        collection(db, ATTENDANCE_COLLECTION),
        where("userId", "==", userId),
        orderBy("checkInAt", "desc"),
        limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
};

export const markAttendance = async (userId: string, userName: string, userPhone: string, method: 'manual' | 'qr' = 'manual') => {
    const newRecord = {
        userId,
        userName,
        userPhone,
        checkInAt: serverTimestamp(),
        status: 'present',
        method
    };
    const docRef = await addDoc(collection(db, ATTENDANCE_COLLECTION), newRecord);
    return { id: docRef.id, ...newRecord };
};

export const getAttendanceSummaryByDay = async (days: number = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const q = query(
    collection(db, ATTENDANCE_COLLECTION),
    where("checkInAt", ">=", Timestamp.fromDate(startDate)),
    orderBy("checkInAt", "asc")
  );
  const snapshot = await getDocs(q);
  
  const summary: Record<string, number> = {};
  snapshot.docs.forEach(doc => {
    const date = doc.data().checkInAt.toDate().toLocaleDateString();
    summary[date] = (summary[date] || 0) + 1;
  });

  return Object.entries(summary).map(([date, count]) => ({ date, count }));
};

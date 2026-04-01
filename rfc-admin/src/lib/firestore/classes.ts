import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp,
  addDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ClassSchedule {
  id: string;
  className: string;
  trainer: string;
  startTime: Timestamp;
  endTime: Timestamp;
  capacity: number;
  currentBookings: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  dayOfWeek: string;
}

export interface Booking {
  id: string;
  classId: string;
  className: string;
  userId: string;
  userName: string;
  userPhone: string;
  bookedAt: Timestamp;
  status: 'confirmed' | 'attended' | 'cancelled';
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  phone: string;
  email: string;
  imageUrl?: string;
  status: 'active' | 'inactive';
}

const CLASSES_COLLECTION = "classes";
const BOOKINGS_COLLECTION = "class_bookings";
const TRAINERS_COLLECTION = "trainers";

export const getClasses = async () => {
  const q = query(
    collection(db, CLASSES_COLLECTION),
    orderBy("startTime", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClassSchedule));
};

export const getClassBookings = async (classId?: string) => {
  let q = query(collection(db, BOOKINGS_COLLECTION), orderBy("bookedAt", "desc"));
  
  if (classId) {
    q = query(q, where("classId", "==", classId));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
};

export const getTrainers = async () => {
  const q = query(
    collection(db, TRAINERS_COLLECTION),
    orderBy("name", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trainer));
};

export const bookClass = async (classId: string, className: string, userId: string, userName: string, userPhone: string) => {
  const newBooking = {
    classId,
    className,
    userId,
    userName,
    userPhone,
    bookedAt: serverTimestamp(),
    status: 'confirmed'
  };
  const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), newBooking);
  return { id: docRef.id, ...newBooking };
};

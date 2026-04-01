import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  limit
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface WorkoutLog {
  id: string;
  userId: string;
  userName: string;
  workoutType: string;
  duration: number; // in minutes
  caloriesBurned: number;
  completedAt: Timestamp;
}

export interface PersonalRecord {
  id: string;
  userId: string;
  userName: string;
  exercise: string;
  value: string; // e.g., "100kg", "5:00 min"
  achievedAt: Timestamp;
  category: 'strength' | 'endurance' | 'flexibility';
}

const WORKOUTS_COLLECTION = "workouts";
const RECORDS_COLLECTION = "personal_records";

export const getAllWorkouts = async (limitCount: number = 50) => {
  const q = query(
    collection(db, WORKOUTS_COLLECTION),
    orderBy("completedAt", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutLog));
};

export const getPersonalRecords = async (limitCount: number = 50) => {
  const q = query(
    collection(db, RECORDS_COLLECTION),
    orderBy("achievedAt", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PersonalRecord));
};

export const getUserWorkouts = async (userId: string) => {
  const q = query(
    collection(db, WORKOUTS_COLLECTION),
    where("userId", "==", userId),
    orderBy("completedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutLog));
};

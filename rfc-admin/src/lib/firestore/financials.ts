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

export interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  plan: string;
  method: 'cash' | 'card' | 'upi' | 'transfer';
  status: 'completed' | 'pending' | 'failed';
  createdAt: Timestamp;
  orderId?: string;
}

const PAYMENTS_COLLECTION = "payments";

export const getRecentPayments = async (limitCount: number = 10) => {
    const q = query(
        collection(db, PAYMENTS_COLLECTION),
        orderBy("createdAt", "desc"),
        limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentRecord));
};

export const getFinancialSummary = async (days: number = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
        collection(db, PAYMENTS_COLLECTION),
        where("createdAt", ">=", Timestamp.fromDate(startDate)),
        where("status", "==", "completed")
    );
    const snapshot = await getDocs(q);
    
    let totalRevenue = 0;
    const dailyRevenue: Record<string, number> = {};
    const methodDistribution: Record<string, number> = {};

    snapshot.docs.forEach(doc => {
        const data = doc.data();
        totalRevenue += data.amount;
        
        const date = data.createdAt.toDate().toLocaleDateString();
        dailyRevenue[date] = (dailyRevenue[date] || 0) + data.amount;

        methodDistribution[data.method] = (methodDistribution[data.method] || 0) + 1;
    });

    return {
        totalRevenue,
        dailyRevenue: Object.entries(dailyRevenue).map(([date, amount]) => ({ date, amount })),
        methodDistribution: Object.entries(methodDistribution).map(([method, count]) => ({ method, count }))
    };
};

export const getExpiringRenewals = async () => {
    // This is essentially just the expiring members filter but for the financials context
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + 7);

    const q = query(
        collection(db, "users"),
        where("isActive", "==", true),
        where("planEndDate", "<=", Timestamp.fromDate(future)),
        where("planEndDate", ">", Timestamp.fromDate(now)),
        orderBy("planEndDate", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const recordManualPayment = async (data: Omit<PaymentRecord, 'id' | 'createdAt'>) => {
    const newPayment = {
        ...data,
        createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, PAYMENTS_COLLECTION), newPayment);
    return { id: docRef.id, ...newPayment };
};

export const getMonthlyRevenue = async () => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const q = query(
        collection(db, PAYMENTS_COLLECTION),
        where("createdAt", ">=", Timestamp.fromDate(currentMonthStart)),
        where("status", "==", "completed")
    );
    const snapshot = await getDocs(q);
    
    let sum = 0;
    snapshot.docs.forEach(doc => {
        sum += doc.data().amount;
    });
    return sum;
};

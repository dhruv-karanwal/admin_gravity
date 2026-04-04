const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

/**
 * Trigger: onPaymentCreated
 * Path: payments/{paymentId}
 * Description: When a payment is recorded, update the member's last_payment_date,
 * expiry_date, and status.
 */
exports.onPaymentCreated = functions.firestore
    .document("payments/{paymentId}")
    .onCreate(async (snap, context) => {
      const paymentData = snap.data();
      const {member_id, amount, months, timestamp} = paymentData;

      if (!member_id) return null;

      const memberRef = db.collection("members").doc(member_id);
      const memberSnap = await memberRef.get();

      if (!memberSnap.exists) return null;

      const memberData = memberSnap.data();
      let currentExpiry = memberData.expiry_date ? 
                          memberData.expiry_date.toDate() : 
                          new Date();
      
      // If member is currently expired, start from today
      if (currentExpiry < new Date()) {
        currentExpiry = new Date();
      }

      // Add months to expiry
      const newExpiry = new Date(currentExpiry);
      newExpiry.setMonth(newExpiry.getMonth() + (months || 1));

      return memberRef.update({
        last_payment_date: timestamp || admin.firestore.FieldValue.serverTimestamp(),
        expiry_date: admin.firestore.Timestamp.fromDate(newExpiry),
        status: "active",
      });
    });

/**
 * Scheduled Function: checkExpirations
 * Frequency: Every 24 hours
 * Description: Checks for members whose expiry_date has passed and marks them as 'expired'.
 */
exports.checkExpirations = functions.pubsub
    .schedule("every 24 hours")
    .onRun(async (context) => {
      const now = admin.firestore.Timestamp.now();
      const expiredMembersQuery = db.collection("members")
          .where("status", "==", "active")
          .where("expiry_date", "<", now);

      const snapshot = await expiredMembersQuery.get();
      
      if (snapshot.empty) {
        console.log("No new expirations found.");
        return null;
      }

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, {status: "expired"});
      });

      await batch.commit();
      console.log(`Marked ${snapshot.size} members as expired.`);
      return null;
    });

/**
 * Trigger: onMemberCreated
 * Path: members/{memberId}
 * Description: Optional - could be used for welcome emails or analytics.
 */
exports.onMemberCreated = functions.firestore
    .document("members/{memberId}")
    .onCreate((snap, context) => {
      console.log(`New member joined: ${snap.id}`);
      return null;
    });

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'gravity-admin-4e60a'
});

const db = admin.firestore();

async function checkDatabase() {
  try {
    const collections = ['admins', 'members', 'users', 'gym_settings', 'plans'];
    for (const colName of collections) {
      console.log(`Checking collection [${colName}]...`);
      const snapshot = await db.collection(colName).get();
      if (snapshot.empty) {
        console.log(`- Collection [${colName}] is EMPTY.`);
      } else {
        console.log(`- Collection [${colName}] has ${snapshot.size} documents.`);
        if (colName === 'admins') {
          snapshot.forEach(doc => {
            console.log(`  - Admin ID: [${doc.id}], Data: ${JSON.stringify(doc.data())}`);
          });
        }
      }
    }
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    process.exit(0);
  }
}

checkDatabase();

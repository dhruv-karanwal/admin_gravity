const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'gravity-admin-4e60a' });
console.log('App initialized');
const db = admin.firestore();
db.listCollections().then(cols => {
  console.log('Collections:', cols.map(c => c.id));
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

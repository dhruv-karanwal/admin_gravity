const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const keyPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(keyPath)) {
  console.error('\n❌ Missing service account key!');
  console.error('   Save it as: scripts/serviceAccountKey.json\n');
  process.exit(1);
}

const serviceAccount = require(keyPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'gravity-admin-4e60a'
});

const db = admin.firestore();

// ----- Schema matches Flutter UserModel exactly -----
// Collection: 'users'
// Fields: uid, name, phone, email, photoUrl, goal, planName,
//         planStartDate (ms), planEndDate (ms), isActive,
//         createdAt (ms), updatedAt (ms)

const plans = [
  { id: 'monthly',    name: 'Monthly',    duration_months: 1,  price: 1500 },
  { id: 'quarterly',  name: 'Quarterly',  duration_months: 3,  price: 4000 },
  { id: 'half_yearly',name: 'Half-yearly',duration_months: 6,  price: 7000 },
  { id: 'annual',     name: 'Annual',     duration_months: 12, price: 12000 }
];

const dummyMembers = [
  { name: 'John Doe',       phone: '9876543210', email: 'john@example.com',    goal: 'weight_loss',  planName: 'Monthly' },
  { name: 'Jane Smith',     phone: '9876543211', email: 'jane@example.com',    goal: 'muscle_gain',  planName: 'Quarterly' },
  { name: 'Mike Ross',      phone: '9876543212', email: 'mike@example.com',    goal: 'endurance',    planName: 'Monthly' },
  { name: 'Rachel Zane',    phone: '9876543213', email: 'rachel@example.com',  goal: 'general',      planName: 'Annual' },
  { name: 'Harvey Specter', phone: '9876543214', email: 'harvey@example.com',  goal: 'muscle_gain',  planName: 'Half-yearly' },
  { name: 'Donna Paulsen',  phone: '9876543215', email: 'donna@example.com',   goal: 'weight_loss',  planName: 'Monthly' },
  { name: 'Louis Litt',     phone: '9876543216', email: 'louis@example.com',   goal: 'endurance',    planName: 'Quarterly' },
  { name: 'Jessica Pearson',phone: '9876543217', email: 'jessica@example.com', goal: 'general',      planName: 'Annual' },
  { name: 'Robert Zane',    phone: '9876543218', email: 'robert@example.com',  goal: 'weight_loss',  planName: 'Monthly' },
  { name: 'Katrina Bennett',phone: '9876543219', email: 'katrina@example.com', goal: 'muscle_gain',  planName: 'Quarterly' }
];

const planDuration = { 'Monthly': 1, 'Quarterly': 3, 'Half-yearly': 6, 'Annual': 12 };
const planPrice    = { 'Monthly': 1500, 'Quarterly': 4000, 'Half-yearly': 7000, 'Annual': 12000 };

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

async function wipeCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  if (snapshot.empty) return;
  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  console.log(`  🗑  Wiped ${snapshot.size} docs from '${collectionName}'`);
}

async function seed() {
  console.log('\n🌱 Starting unified seed...\n');

  // Wipe old data first
  console.log('🗑  Wiping existing data...');
  await wipeCollection('users');
  await wipeCollection('payments');
  await wipeCollection('plans');
  await wipeCollection('gym_settings');
  await wipeCollection('announcements');

  // 1. Gym Settings
  console.log('\n⚙️  Seeding gym_settings...');
  await db.collection('gym_settings').doc('config').set({
    name: 'Gravity Fitness',
    address: '123 Fitness Street, Gym City',
    contact_phone: '+91 99999 88888',
    email: 'contact@gravityfitness.com',
    currency: 'INR',
    opening_time: '06:00',
    closing_time: '22:00'
  });

  // 2. Plans
  console.log('📋 Seeding plans...');
  for (const plan of plans) {
    await db.collection('plans').doc(plan.id).set(plan);
  }

  // 3. Users + Payments
  console.log('👥 Seeding users and payments...');
  for (const m of dummyMembers) {
    const uid = `seed_${m.phone}`;
    const now = Date.now();
    const joinedMs = now - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000;
    const planStart = new Date(joinedMs);
    const planEnd = addMonths(planStart, planDuration[m.planName]);

    // User document — fields match Flutter UserModel exactly
    await db.collection('users').doc(uid).set({
      uid,
      name: m.name,
      phone: m.phone,
      email: m.email,
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`,
      goal: m.goal,
      planName: m.planName,
      pin: null,
      planStartDate: planStart.getTime(),
      planEndDate: planEnd.getTime(),
      isActive: true,
      createdAt: joinedMs,
      updatedAt: joinedMs,
    });

    // Payment record — fields match admin dashboard PaymentRecord
    await db.collection('payments').add({
      userId: uid,
      userName: m.name,
      amount: planPrice[m.planName],
      plan: m.planName,
      method: 'cash',
      status: 'completed',
      createdAt: admin.firestore.Timestamp.fromMillis(joinedMs),
    });

    console.log(`  ✅ ${m.name} (${m.planName})`);
  }

  // 4. Announcements
  console.log('\n📣 Seeding announcements...');
  await db.collection('announcements').add({
    title: 'Welcome to Gravity Fitness!',
    content: 'New plans available. Check out our Annual membership for the best value.',
    timestamp: admin.firestore.Timestamp.now(),
    priority: 'high'
  });

  console.log('\n✅ Seeding completed successfully!\n');
  console.log('Collections seeded:');
  console.log('  • users (10 members)');
  console.log('  • payments (10 records)');
  console.log('  • plans (4 plans)');
  console.log('  • gym_settings (1 doc)');
  console.log('  • announcements (1 doc)\n');
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});

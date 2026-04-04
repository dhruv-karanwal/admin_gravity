# 🌱 rfc-admin / scripts

Utility scripts for database management. Run from the `rfc-admin/` directory.

---

## `seed.js` — Populate Firestore with Test Data

### What it does
Wipes existing data in `users`, `payments`, `plans`, `gym_settings`, `announcements`, then seeds fresh:
- **10 members** (John Doe, Jane Smith, Harvey Specter, etc.)
- **10 payment records** (one per member, matching their plan)
- **4 plan definitions** (Monthly ₹1500, Quarterly ₹4000, Half-yearly ₹7000, Annual ₹12000)
- **1 gym_settings** document
- **1 announcement**

### Prerequisites
You need a **service account key** from Firebase Console:
1. Go to: https://console.firebase.google.com/project/gravity-admin-4e60a/settings/serviceaccounts/adminsdk
2. Click **"Generate new private key"**
3. Save the downloaded JSON as: `scripts/serviceAccountKey.json`

> ⚠️ `serviceAccountKey.json` is in `.gitignore` — **never commit it**

### Run
```sh
# From the rfc-admin/ directory:
node scripts/seed.js
```

### Schema produced
All `users` documents match the Flutter `UserModel.toMap()` format exactly:
- Dates are **millisecondsSinceEpoch integers** (not Firestore Timestamps)
- Plan names are exactly: `Monthly`, `Quarterly`, `Half-yearly`, `Annual`
- Goals are: `weight_loss`, `muscle_gain`, `endurance`, `general`

---

## `test_db.js` — Debug Firebase Connection

Quick connectivity test. Tries to list all Firestore collections.

```sh
node scripts/test_db.js
```

Useful to verify service account credentials are working before running seed.

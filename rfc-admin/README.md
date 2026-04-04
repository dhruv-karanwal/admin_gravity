# 🖥️ Gravity Fitness — Admin Dashboard (rfc-admin)

> **Last Updated:** April 3, 2026  
> **Status:** Running on unified Firebase project `gravity-admin-4e60a`  
> **Dev Server:** `npm run dev` → http://localhost:3000

---

## 📋 Quick Start (When Resuming Work)

```sh
cd "d:\GRAVITY\Admin Dashboard\rfc-admin"
npm run dev
```

That's it. The dashboard connects to the live Firestore database automatically.

---

## 🔥 Firebase Configuration

- **Project:** `gravity-admin-4e60a`
- **Config file:** `.env.local` — already populated with API keys
- **Rules:** `firestore.rules` — deployed ✅
- **Indexes:** `firestore.indexes.json` — deployed ✅

> **Do NOT run `firebase deploy --only functions`** — Cloud Functions are intentionally removed (requires Blaze billing plan). All that logic now lives in `src/lib/firestore/members.ts`.

---

## 🗄️ Firestore Collections (Unified Schema)

This dashboard **shares the same Firestore database** as the Flutter member app.

| Collection | Key Purpose | Note |
|------------|------------|------|
| `users` | All gym members | Dates stored as **ms integers**, NOT Timestamps |
| `payments` | Payment records | Created when `renewMembership()` is called |
| `plans` | Plan catalog | 4 plans: Monthly, Quarterly, Half-yearly, Annual |
| `gym_settings` | Gym config | Single doc with id `config` |
| `announcements` | Member-facing notices | |
| `audit_logs` | Admin action history | Written by `renewMembership()` |

### `users` document shape
```typescript
{
  uid: string,
  name: string,
  phone: string,
  email?: string,
  photoUrl?: string,
  goal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general',
  planName: 'Monthly' | 'Quarterly' | 'Half-yearly' | 'Annual',
  planStartDate: number,  // millisecondsSinceEpoch
  planEndDate: number,    // millisecondsSinceEpoch
  isActive: boolean,
  createdAt: number,
  updatedAt: number,
  pin: null
}
```

---

## 🏗️ Project Structure

```
rfc-admin/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx         # Root (redirects to dashboard)
│   │   ├── dashboard/       # Main overview page
│   │   ├── members/         # Member management
│   │   ├── payments/        # Financial records
│   │   ├── attendance/      # Check-in terminal & history
│   │   ├── classes/         # Class schedule & bookings
│   │   ├── reports/         # Analytics & exports
│   │   └── notifications/   # FCM push composer
│   ├── components/          # Reusable UI components
│   │   ├── KineticCard      # Hover-animated containers
│   │   ├── DataTable        # Filterable data grids
│   │   ├── MetricPulse      # Heartbeat KPI widgets
│   │   ├── StatusChip       # Color-coded status badges
│   │   └── LoadingShimmer   # Skeleton loading states
│   ├── lib/
│   │   ├── firebase.ts      # Firebase client init
│   │   └── firestore/
│   │       ├── members.ts   # ⭐ Member CRUD + expiry sync + renewMembership()
│   │       ├── financials.ts # Payment queries
│   │       ├── attendance.ts # Check-in/out
│   │       ├── classes.ts    # Class & booking ops
│   │       └── workouts.ts   # Workout log queries
│   ├── context/             # React Context providers (auth, theme)
│   └── store/               # Zustand global state
├── scripts/
│   └── seed.js              # ⭐ Run this to populate Firestore with test data
├── .env.local               # Firebase API keys (do not commit)
├── firebase.json            # Firestore-only config (no functions)
├── firestore.rules          # Security rules
├── firestore.indexes.json   # Composite indexes
├── progress.md              # ← Detailed session progress log
└── README.md                # ← You are here
```

---

## ⭐ Key File: `src/lib/firestore/members.ts`

This is the most important file in the project. It handles:

- `getAllMembers()` — fetches all members, auto-syncs expired status (no Cloud Functions)
- `renewMembership(uid, planName, method)` — atomically records payment + extends expiry
- `getExpiringMembers(days)` — members expiring within N days
- `addMember(data)` — creates a new member with correct plan dates
- `searchMembers(query)` — prefix search by name

> **Why no Cloud Functions?** Cloud Functions require the Firebase Blaze (paid) plan. Instead, expiry syncing runs inline every time members are loaded.

---

## 🔑 Environment Variables (`.env.local`)

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gravity-admin-4e60a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gravity-admin-4e60a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gravity-admin-4e60a.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## 🌱 Seeding the Database

If you need to wipe and re-seed test data:

```sh
# 1. Make sure scripts/serviceAccountKey.json exists (service account from Firebase Console)
# 2. Run:
node scripts/seed.js
```

This creates: 10 members, 10 payment records, 4 plans, gym settings, 1 announcement.

> `scripts/serviceAccountKey.json` is in `.gitignore` — never commit it.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Database | Cloud Firestore |
| Charts | Recharts |
| Icons | Lucide React |
| Auth | Firebase Auth |

---

## ✅ Completed Features

- [x] Obsidian-to-Red design system with glassmorphism
- [x] Member management (list, search, add, renew, deactivate)
- [x] Payment recording with atomic member expiry update
- [x] Financial analytics (revenue charts, method distribution)
- [x] Attendance terminal + QR scanner UI
- [x] Class schedule & booking management
- [x] AI insights engine on main dashboard
- [x] Push notification composer (FCM UI)
- [x] Reports hub with export templates
- [x] Unified Firestore schema matching Flutter app

## ⏳ Pending

- [ ] Enable Firebase Auth in Console (Email/Password for admin login)
- [ ] Add Super Admin UID to `admins` Firestore collection
- [ ] Implement CSV/PDF export in Reports
- [ ] Interactive audit log timeline
- [ ] Automated billing alerts for overdue renewals

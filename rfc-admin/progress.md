# 📋 Progress Log — RFC Admin Dashboard

> **Last Updated:** April 3, 2026  
> This file is a running session log. Update it every time you resume/end a work session.

---

## 🟢 Current Status

**Phase: Firebase Unification Complete — Ready for Auth Setup**

The admin dashboard is fully connected to the unified Firebase project and serving live Firestore data. The seeded database has 10 test members. The next blocker to resolve before production is enabling Firebase Authentication.

---

## 📅 Session Log

### Session: April 3, 2026 — Firebase Unification

**Goal:** Consolidate `gravity_fitness` Flutter app and `rfc-admin` admin dashboard onto a single Firebase project.

**Completed this session:**

1. **Chose fire project:** `gravity-admin-4e60a` (was already used by the admin dashboard)
2. **Flutter re-pointed:** Ran `flutterfire configure` in `gravity_fitness/` — now uses `gravity-admin-4e60a`
3. **Wiped old data:** Cleared all existing dummy/stale Firestore data
4. **Deployed security rules:** `firestore.rules` — role-based access (admin vs. member vs. public)
5. **Deployed indexes:** `firestore.indexes.json` — compound queries for members, payments, check-ins
6. **Cloud Functions REMOVED:** Intentionally skipped — requires Blaze (paid) plan. Logic moved inline:
   - Member expiry auto-syncs in `getAllMembers()` / `getMemberById()`
   - Payment + member update is one atomic `writeBatch` in `renewMembership()`
7. **Schema unified:** Rewrote `members.ts` to match Flutter `UserModel` exactly:
   - Collection: `users` (not `members`)
   - Dates: **millisecondsSinceEpoch integers** (not Firestore Timestamps)
   - Fields: `planStartDate`, `planEndDate`, `isActive`, `planName`, `goal`, `pin`
8. **Database seeded:** `node scripts/seed.js` from `rfc-admin/` — populated:
   - 10 dummy members (John Doe, Jane Smith, Harvey Specter, etc.)
   - 10 payment records (one per member)
   - 4 plan definitions
   - 1 gym_settings doc
   - 1 announcement

---

### Session: April 1, 2026 — UI Build Out

**Completed:**
- Obsidian-to-Red design system established
- Bento-style main dashboard with AI insights engine
- Member management pages (list, search, add, renew, deactivate)  
- Financials page (revenue charts, method distribution via Recharts)
- Attendance terminal with QR scanner dark UI
- Push notification composer
- Reports hub with export templates
- Role-based auth layout guards

---

## ✅ Full Feature Checklist

### Infrastructure
- [x] Firebase project: `gravity-admin-4e60a`
- [x] Next.js 14 app bootstrapped
- [x] Firestore security rules deployed
- [x] Composite indexes deployed
- [x] Seed script working (`scripts/seed.js`)
- [x] `.env.local` configured
- [ ] Firebase Auth enabled (Email/Password for admin login) ← **DO THIS NEXT**
- [ ] Super Admin UID added to `admins` Firestore collection

### Member Management
- [x] List all members with expiry status
- [x] Search members by name
- [x] Add new member with plan selection
- [x] Renew membership (atomic: payment + expiry update)
- [x] Deactivate member
- [x] Auto-sync expired status on load

### Financials
- [x] Revenue over time charts
- [x] Payment method distribution
- [x] Recent payments list
- [x] Monthly revenue summary
- [ ] CSV/PDF export

### Attendance
- [x] QR scanner terminal UI
- [x] Access history view
- [ ] Real QR code scanning logic (currently UI-only)

### Reports
- [x] Monthly revenue report
- [x] Engagement audit
- [x] Trainer productivity panel
- [ ] CSV/PDF download logic

### Notifications
- [x] FCM broadcast composer UI
- [ ] Real FCM send integration

---

## ⚠️ Known Issues / Technical Debt

| Issue | Detail | Fix |
|-------|--------|-----|
| Date type mismatch risk | `users` dates are ms integers; `payments.createdAt` is a Firestore Timestamp | Keep consistent — don't mix types in new writes |
| Auth not yet configured | Admin login UI exists but no real auth backend | Enable Email/Password in Firebase Console |
| `admins` collection empty | Security rules check this collection for elevated access | Add Super Admin UID manually |
| Attendance `userId` missing | `attendance` docs don't always have `userId` field (legacy Flutter issue) | Add `userId` when logging attendance in Flutter |

---

## 🔁 How to Resume Work

1. Open terminal at `d:\GRAVITY\Admin Dashboard\rfc-admin`
2. `npm run dev` → http://localhost:3000
3. Check this file for current status
4. Check root `d:\GRAVITY\README.md` for full architecture picture

---

## 🔮 Upcoming Milestones

| Priority | Task |
|----------|------|
| 🔴 High | Enable Firebase Auth (Console) + wire admin login |
| 🔴 High | Add Super Admin UID to `admins` collection |
| 🟡 Medium | Test Flutter app reads/writes with unified schema |
| 🟡 Medium | Implement CSV export in Reports |
| 🟢 Low | FCM real notification send |
| 🟢 Low | Audit log timeline UI |

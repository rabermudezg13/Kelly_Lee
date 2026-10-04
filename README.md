# Kelly Education · Lee County

Independent front desk app based on the visitor registration / staff portal workflows of [kelly-app-v2](https://github.com/rabermudezg13/kelly-app-v2), reference commit `1589e02`. React + TypeScript + Vite. Backend entirely Firebase Authentication + Cloud Firestore. No Railway server or original production endpoints.

Live app: https://kelly-education-lee.web.app (Firebase Hosting site `kelly-education-lee` in project `frontdeskbase`).

## Features
- Public visitor registration: name, required email/phone/ZIP, reason, host, server-generated arrival time.
- Staff sign-in only. Project administrators create staff accounts in Firebase Console. Public Authentication signup is disabled.
- Authenticated staff see the live visitor roster, arrival times in America/New_York, search, today's arrivals, currently checked in, and checkout.
- Responsive desktop/mobile screens; explicit local demo using fictional in-memory data.

## Local run
```sh
npm ci
cp .env.example .env.local
npm run dev
```
For a fictional preview set `VITE_DEMO_MODE=true` in `.env.local`. Demo data is temporary and never sent to Firebase. Do not enable demo on a production build.

## Connect frontdeskbase
1. Open Firebase project frontdeskbase; register a Web app in Project settings. Copy apiKey, authDomain, projectId and appId into the corresponding VITE_FIREBASE variables. Web config is public; never put service account private keys in Vite.
2. Enable Authentication → Email/Password. Disable client signup with `client.permissions.disabledUserSignup=true`. Add the local / deployed hostname to Authorized domains.
3. Create Firestore in production mode. Publish `firestore.rules` before using real records.
4. An authorized project administrator creates staff in Firebase Console → Authentication → Users → Add user. Use email/password. Existing accounts can sign in immediately: no approval, email verification or leeStaff document is required.
5. Keep Authentication `client.permissions.disabledUserSignup=true`; public account creation is blocked. Visitor check-in does not create an Auth account.


## Verification
```sh
npm test
# With Firebase CLI and Java 21 installed:
npm run test:rules
npm run build
```
Roster loads all visits in the current Florida week (Monday 00:00 through next Monday 00:00), with no 500-record truncation. Older visits remain saved. Search history is read-only and independent: partial visitor name (case/accent insensitive) and/or inclusive local dates, with document cursors and a Continue searching / load more button. Name search scans at most 1,000 records per request and indicates when more records remain; it covers legacy records without a migration. Visitors submit without creating Authentication accounts and cannot read records. Visitor submission is append-only; checkout requires an authenticated email/password account. For a shared kiosk use the visitor page in a separate browser profile from staff sessions. Before public launch add App Check enforcement / abuse controls and complete authenticated end-to-end acceptance with test records. No real visitor records have been copied from the reference project.

Firebase implementation references: [password authentication](https://firebase.google.com/docs/auth/web/password-auth), [Firestore listeners](https://firebase.google.com/docs/firestore/query-data/listen), [security conditions](https://firebase.google.com/docs/firestore/security/rules-conditions).

Deployment verified on 2026-10-03 (America/New_York): Hosting and Firestore rules released; home, visitor and staff screens verified in browser. Six rules tests passed using a demo Firestore emulator; ten UI/date tests passed. Real staff acceptance is pending. Firestore database region: us-east1.

## Staff creation policy
Public signup is disabled at the Firebase Authentication project level, including anonymous account creation. Staff profiles are writable only through administrative Console/Admin SDK access; all client creates/updates/deletes are denied. Existing staff logins continue to work. Visitors create only strictly validated leeVisits documents (name, host, allowed purpose, server timestamp, null checkout, createdBy=visitor). This public write-only intake preserves visitor check-in while Authentication signup is disabled. Authentication configuration is shared by all apps in frontdeskbase.

Reference: https://docs.cloud.google.com/identity-platform/docs/reference/rest/v2/Config (ClientPermissionConfig).

Weekly/history verification: emulated fixtures confirm 501 weekly arrivals are all shown, archived visits remain stored, search continues beyond 1,000 scanned documents and repeated timestamps do not skip records. DST weeks use local boundaries rather than fixed 168-hour UTC periods.

Visitor contact: required email, phone (7–15 digits with common separators) and US ZIP (5 digits or ZIP+4) are stored as strings and shown to staff in weekly roster and history. Existing records without contact fields show —; no migration or deletion. Contact cannot be edited during checkout.

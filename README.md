# Kelly Education · Lee County

Independent front desk app based on the visitor registration / staff portal workflows of [kelly-app-v2](https://github.com/rabermudezg13/kelly-app-v2), reference commit `1589e02`. React + TypeScript + Vite. Backend entirely Firebase Authentication + Cloud Firestore. No Railway server or original production endpoints.

## Features
- Public visitor registration: name, reason, host, server-generated arrival time.
- Staff account registration and sign-in. New accounts await administrator approval and email verification.
- Approved staff see the live visitor roster, arrival times in America/New_York, search, today's arrivals, currently checked in, and checkout.
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
2. Enable Authentication → Email/Password and Anonymous. Add the local / deployed hostname to Authorized domains.
3. Create Firestore in production mode. Publish `firestore.rules` before using real records.
4. Staff register and verify their email. An authorized project administrator reviews the account and changes `leeStaff/{uid}.approved` to `true` in Firebase Console. Client accounts cannot grant their own access. Click Check approval status to refresh the token.
5. Build and publish with Firebase CLI:
```sh
npm run build
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules,hosting --project frontdeskbase
```
**Review existing Hosting sites and Firestore rules first:** deploying these rules replaces the project's rules. Merge with any existing collections' policies before deployment. Hosting default site may already host another app; use a separate Hosting site/target when appropriate. No deployment has been performed by this setup.

## Verification
```sh
npm test -- tests/app.test.tsx
npm run build
```
Roster loads the newest 500 visits; counters and filters apply to that window. Anonymous visitor sessions cannot read records. Visitor submission is append-only; checkout requires verified, approved staff. For a shared kiosk use the visitor page in a separate browser profile from staff sessions. Before public launch add App Check enforcement / abuse controls and complete authenticated end-to-end acceptance with test records. No real visitor records have been copied from the reference project.

Firebase implementation references: [password authentication](https://firebase.google.com/docs/auth/web/password-auth), [Firestore listeners](https://firebase.google.com/docs/firestore/query-data/listen), [security conditions](https://firebase.google.com/docs/firestore/security/rules-conditions).

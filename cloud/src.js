/* Source for cloud/firebase.js: the small part of the Firebase SDK that TrainTanmay uses
   (Google sign-in and one Firestore record per person). Rebuild with:  sh cloud/build.sh
   The sync logic itself lives in save.js; this file only wraps Firebase. */
import { initializeApp } from 'firebase/app';
import {
  initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, browserPopupRedirectResolver,
  GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut
} from 'firebase/auth';
import { getFirestore, doc, collection, query, where, getDoc, getDocs, setDoc, deleteDoc, runTransaction, serverTimestamp } from 'firebase/firestore/lite';

let auth = null, db = null;

function init(config) {
  if (auth) return;
  const app = initializeApp(config);
  auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence],
    popupRedirectResolver: browserPopupRedirectResolver
  });
  db = getFirestore(app);
  getRedirectResult(auth).catch(() => {});
}

function signIn() {
  const p = new GoogleAuthProvider();
  p.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, p).catch((e) => {
    const c = e && e.code;
    // popups blocked (some home-screen apps and school browsers): go to Google and come back instead
    if (c === 'auth/popup-blocked' || c === 'auth/operation-not-supported-in-this-environment') return signInWithRedirect(auth, p);
    throw e;
  });
}

function onUser(cb) { return onAuthStateChanged(auth, (u) => cb(u ? { uid: u.uid, name: u.displayName || '', email: u.email || '', photo: u.photoURL || '' } : null)); }

/* change(remote) gets the stored record (or null) and returns the record to store (or null to leave it) */
function update(uid, change) {
  const ref = doc(db, 'users', uid);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const next = await change(snap.exists() ? snap.data() : null);
    if (next) tx.set(ref, Object.assign({}, next, { updated: serverTimestamp() }));
    return next;
  });
}

/* small Firestore helpers for the study leaderboards (league.js) */
const fs = {
  get: (path) => getDoc(doc(db, path)).then((s) => (s.exists() ? s.data() : null)),
  del: (path) => deleteDoc(doc(db, path)),
  set: (path, data, merge) => setDoc(doc(db, path), data, merge ? { merge: true } : {}),
  list: (path) => getDocs(collection(db, path)).then((q) => q.docs.map((d) => ({ id: d.id, data: d.data() }))),
  mine: (path, field, value) => getDocs(query(collection(db, path), where(field, 'array-contains', value))).then((q) => q.docs.map((d) => ({ id: d.id, data: d.data() }))),
  /* change(current or null) returns the new record, or null to leave it */
  tx: (path, change) => runTransaction(db, async (t) => {
    const ref = doc(db, path), snap = await t.get(ref);
    const next = await change(snap.exists() ? snap.data() : null);
    if (next) t.set(ref, next);
    return next;
  }),
  /* several records at once: change([current or null, ...]) returns [new record or null to leave it, ...] */
  txMany: (paths, change) => runTransaction(db, async (t) => {
    const refs = paths.map((p) => doc(db, p)), snaps = [];
    for (const r of refs) snaps.push(await t.get(r));
    const next = await change(snaps.map((s) => (s.exists() ? s.data() : null)));
    next.forEach((n, i) => { if (n) t.set(refs[i], n); });
    return next;
  }),
  now: serverTimestamp
};

window.ttCloudSDK = { init, signIn, signOut: () => signOut(auth), onUser, update, fs, uid: () => (auth && auth.currentUser ? auth.currentUser.uid : null) };

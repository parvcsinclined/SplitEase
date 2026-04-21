// ── Firebase Configuration & Service Layer ──────────────────────────
// Initializes Firebase app, Auth, and Firestore.
// Exports helper functions for all Firestore CRUD operations.

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

// ── Firebase Config (from User) ────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCaUf58aAuY6iInmmyqmL10mBobrlhZhfc",
  authDomain: "splitease-5fb14.firebaseapp.com",
  projectId: "splitease-5fb14",
  storageBucket: "splitease-5fb14.firebasestorage.app",
  messagingSenderId: "430515744925",
  appId: "1:430515744925:web:bdb249a9fe4c2a18732474",
  measurementId: "G-T3KXB1R90N"
};

// ── Initialize Firebase ─────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ── Auth Helpers ────────────────────────────────────────────────────
export const registerUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

const googleProvider = new GoogleAuthProvider();
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

export const logoutUser = () => signOut(auth);

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

export const updateUserProfile = (user, data) => updateProfile(user, data);

// ── Users Collection ────────────────────────────────────────────────
export const createUserDoc = async (uid, data) => {
  await setDoc(doc(db, "users", uid), {
    uid,
    ...data,
    createdAt: serverTimestamp(),
  }, { merge: true });
};

export const getUserDoc = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getUsersByIds = async (uids) => {
  if (!uids || uids.length === 0) return [];
  const users = [];
  for (const uid of uids) {
    const user = await getUserDoc(uid);
    if (user) users.push(user);
  }
  return users;
};

// ── Groups Collection ───────────────────────────────────────────────
export const createGroup = async (groupData) => {
  const docRef = await addDoc(collection(db, "groups"), {
    ...groupData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const subscribeToUserGroups = (uid, callback) => {
  const q = query(
    collection(db, "groups"),
    where("members", "array-contains", uid)
  );
  return onSnapshot(q, (snapshot) => {
    const groups = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(groups);
  });
};

export const getGroupById = async (groupId) => {
  const snap = await getDoc(doc(db, "groups", groupId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateGroup = async (groupId, data) => {
  await updateDoc(doc(db, "groups", groupId), data);
};

// ── Expenses Subcollection ──────────────────────────────────────────
export const addExpenseToDb = async (groupId, expenseData) => {
  const ref = collection(db, "groups", groupId, "expenses");
  const docRef = await addDoc(ref, {
    ...expenseData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const subscribeToExpenses = (groupId, callback) => {
  const q = query(
    collection(db, "groups", groupId, "expenses"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(expenses);
  });
};

export const deleteExpenseFromDb = async (groupId, expenseId) => {
  await deleteDoc(doc(db, "groups", groupId, "expenses", expenseId));
};

// ── Settlements Subcollection ───────────────────────────────────────
export const addSettlementToDb = async (groupId, settlementData) => {
  const ref = collection(db, "groups", groupId, "settlements");
  const docRef = await addDoc(ref, {
    ...settlementData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const subscribeToSettlements = (groupId, callback) => {
  const q = query(
    collection(db, "groups", groupId, "settlements"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const settlements = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(settlements);
  });
};

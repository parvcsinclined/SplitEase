// ── AuthContext.jsx ──────────────────────────────────────────────────
// Global authentication context using createContext, useState, useEffect.
// Provides currentUser state and auth methods to the entire app.

import { createContext, useState, useEffect } from "react";
import {
  auth,
  registerUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
  onAuthChange,
  createUserDoc,
  updateUserProfile,
} from "../services/firebase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect: subscribes to Firebase onAuthStateChanged on mount
  // Cleanup unsubscribes to prevent memory leaks
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = async (email, password, displayName) => {
    const credential = await registerUser(email, password);
    await updateUserProfile(credential.user, { displayName });
    await createUserDoc(credential.user.uid, {
      displayName,
      email,
      photoURL: "",
    });
    return credential;
  };

  const login = (email, password) => loginUser(email, password);
  
  const googleSignIn = async () => {
    const credential = await loginWithGoogle();
    await createUserDoc(credential.user.uid, {
      displayName: credential.user.displayName,
      email: credential.user.email,
      photoURL: credential.user.photoURL,
    }).catch(console.error);
    return credential;
  };

  const logout = () => logoutUser();

  const value = { currentUser, loading, register, login, googleSignIn, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

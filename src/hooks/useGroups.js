// ── useGroups.js ─────────────────────────────────────────────────────
// Custom hook: fetches groups where current user is a member.
// Hooks: useState, useEffect, useContext

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { subscribeToUserGroups } from "../services/firebase";

export function useGroups() {
  const { currentUser } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeToUserGroups(currentUser.uid, (fetchedGroups) => {
      setGroups(fetchedGroups);
      setLoading(false);
    });
    return unsubscribe;
  }, [currentUser]);

  return { groups, loading };
}

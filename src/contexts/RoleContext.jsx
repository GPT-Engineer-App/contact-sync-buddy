import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const RoleContext = createContext();

export function useRole() {
  return useContext(RoleContext);
}

export function RoleProvider({ children }) {
  const { currentUser } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (currentUser) {
        const q = query(collection(db, "roles"), where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setRole(querySnapshot.docs[0].data().role);
        }
      }
      setLoading(false);
    };

    fetchRole();
  }, [currentUser]);

  const value = {
    role,
  };

  return (
    <RoleContext.Provider value={value}>
      {!loading && children}
    </RoleContext.Provider>
  );
}
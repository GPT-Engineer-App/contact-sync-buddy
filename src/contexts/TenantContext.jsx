import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const TenantContext = createContext();

export function useTenant() {
  return useContext(TenantContext);
}

export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      const tenantId = localStorage.getItem("tenantId");
      if (tenantId) {
        const q = query(collection(db, "tenants"), where("id", "==", tenantId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setTenant(querySnapshot.docs[0].data());
        }
      }
      setLoading(false);
    };

    fetchTenant();
  }, []);

  const value = {
    tenant,
    setTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {!loading && children}
    </TenantContext.Provider>
  );
}
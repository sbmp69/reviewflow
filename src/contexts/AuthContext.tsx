"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

interface AuthContextType {
  user: User | null;
  organizationId: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, organizationId: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const q = query(collection(db, "organization_members"), where("user_id", "==", user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setOrganizationId(querySnapshot.docs[0].data().organization_id);
          } else {
            setOrganizationId(null);
          }
        } catch (error) {
          console.error("Error fetching organization:", error);
          setOrganizationId(null);
        }
      } else {
        setOrganizationId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, organizationId, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

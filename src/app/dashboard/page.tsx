"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading || !user) {
    return <div className="p-8 flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Log Out</Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border">
        <p className="text-lg">Welcome back, <strong>{user.displayName || user.email}</strong>! 👋</p>
        <p className="text-gray-500 mt-2">
          This is your central hub for managing review requests. Phase 1 Foundation setup is complete.
        </p>
      </div>
    </div>
  );
}

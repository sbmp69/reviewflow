"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError("");
    setIsSubmitting(true);

    try {
      // 1. Create Organization
      const orgRef = await addDoc(collection(db, "organizations"), {
        name: businessName,
        slug: businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      // 2. Create Organization Member (Owner)
      await addDoc(collection(db, "organization_members"), {
        organization_id: orgRef.id,
        user_id: user.uid,
        role: "owner",
        created_at: serverTimestamp(),
      });

      // 3. Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create business.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome to ReviewFlow! 🎉</CardTitle>
          <CardDescription>Let's get your business set up to start collecting reviews.</CardDescription>
        </CardHeader>
        <form onSubmit={handleCreateBusiness}>
          <CardContent className="space-y-4">
            {error && <div className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="businessName">What is your business name?</Label>
              <Input
                id="businessName"
                placeholder="e.g. Café Mocha"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>
            {/* Additional onboarding steps like Category, Google Link can be added here in future phases */}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Setting up..." : "Complete Setup"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

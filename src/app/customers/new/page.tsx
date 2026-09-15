"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCustomerPage() {
  const { user, organizationId, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [hasConsent, setHasConsent] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (loading || !user) return <div className="p-8">Loading...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) {
      setError("Organization not found.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");

    try {
      // 1. Create Customer Document
      const customerRef = await addDoc(collection(db, "customers"), {
        organization_id: organizationId,
        name,
        phone,
        email: email || null,
        consent_status: hasConsent ? "granted" : "revoked",
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      // 2. Create Transaction Document
      let transactionId = null;
      if (amount && parseFloat(amount) > 0) {
        const txRef = await addDoc(collection(db, "transactions"), {
          organization_id: organizationId,
          customer_id: customerRef.id,
          amount: parseFloat(amount),
          currency: "INR",
          source: "manual",
          purchased_at: serverTimestamp(),
          created_at: serverTimestamp(),
        });
        transactionId = txRef.id;
      }

      // 3. Trigger Scheduling API
      if (hasConsent) {
        await fetch("/api/requests/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            organizationId,
            customerId: customerRef.id,
            transactionId
          })
        });
      }

      router.push("/customers");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to add customer");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/customers" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Customers
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add Customer</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="text-red-500 bg-red-50 p-2 rounded text-sm">{error}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Purchase Amount (Optional)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="650"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input 
                type="checkbox" 
                id="consent" 
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={hasConsent}
                onChange={(e) => setHasConsent(e.target.checked)}
              />
              <Label htmlFor="consent" className="font-normal text-sm">
                Customer has consented to receive WhatsApp messages
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Customer"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

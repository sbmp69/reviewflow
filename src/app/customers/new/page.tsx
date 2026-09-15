"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AppLayout from "@/components/AppLayout";

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

  if (loading || !user) return <div className="p-8 flex justify-center items-center h-screen bg-[#FAFAFC]">Loading...</div>;

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
        const response = await fetch("/api/requests/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            organizationId,
            customerId: customerRef.id,
            transactionId
          })
        });

        if (!response.ok) {
          const resData = await response.json();
          console.error("Schedule API Failed:", resData);
          // We won't block redirecting, but this means the message might not send
        }
      }

      router.push("/customers");
    } catch (err: any) {
      console.error("Full add error:", err);
      setError(err.message || "Failed to add customer. Check your database permissions or network.");
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/customers" className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Customers
        </Link>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Add Customer</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              {error && <div className="text-red-600 bg-red-50/50 border border-red-200 p-3 rounded-md text-sm font-medium">{error}</div>}
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-slate-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">WhatsApp Number</Label>
                <Input
                  id="phone"
                  placeholder="e.g. 919876543210 (Include country code)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-slate-50"
                />
                <p className="text-xs text-slate-500">Must include country code without the +. E.g. 91 for India.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email <span className="text-slate-400 font-normal">(Optional)</span></Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-slate-700 font-medium">Purchase Amount <span className="text-slate-400 font-normal">(Optional)</span></Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="650"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                <input 
                  type="checkbox" 
                  id="consent" 
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                />
                <Label htmlFor="consent" className="font-medium text-slate-700 cursor-pointer">
                  Customer has consented to receive WhatsApp messages
                </Label>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100 pt-6">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold" disabled={isSubmitting}>
                {isSubmitting ? "Adding Customer..." : "Add Customer & Send Request"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}

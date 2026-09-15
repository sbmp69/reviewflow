"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    features: ["50 requests/month", "1 location", "Basic dashboard", "QR code"],
  },
  {
    id: "starter",
    name: "Starter",
    price: "₹499/mo",
    features: ["500 requests", "WhatsApp automation", "Analytics", "CSV import"],
  },
  {
    id: "growth",
    name: "Growth",
    price: "₹999/mo",
    features: ["2,000 requests", "Advanced analytics", "AI responses", "Review monitoring"],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹1,999/mo",
    features: ["10,000 requests", "Multiple locations", "Team members", "Priority support"],
  },
];

export default function BillingPage() {
  const { user, organizationId, loading } = useAuth();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  if (loading || !user) return <div className="p-8">Loading...</div>;

  const handleSubscribe = async (planId: string) => {
    if (planId === "free") return; // Already on free
    if (!organizationId) return;
    
    setIsProcessing(planId);

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, organizationId })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.mocked) {
        alert(`[Mock Checkout] Successfully upgraded to ${planId} plan! Order ID: ${data.orderId}`);
        router.push("/dashboard");
        return;
      }

      // Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Ensure this is set for real integration
        amount: data.amount,
        currency: data.currency,
        name: "ReviewFlow",
        description: `Upgrade to ${planId} plan`,
        order_id: data.orderId,
        handler: function (response: any) {
          // Handle payment success (trigger backend verification)
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          router.push("/dashboard");
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        theme: {
          color: "#4f46e5", // Indigo-600
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error(err);
      alert("Failed to initiate checkout: " + err.message);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/dashboard" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-gray-500">Choose the right plan for your business needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={`relative flex flex-col ${plan.popular ? 'border-indigo-600 shadow-md border-2' : ''}`}>
            {plan.popular && (
              <div className="absolute top-0 right-0 -mt-3 mr-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-3xl font-bold text-gray-900 mt-2">{plan.price}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={plan.id === "free" ? "outline" : "default"} 
                className="w-full"
                onClick={() => handleSubscribe(plan.id)}
                disabled={isProcessing === plan.id}
              >
                {isProcessing === plan.id ? "Processing..." : plan.id === "free" ? "Current Plan" : "Upgrade"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Razorpay Script injection can be added centrally in layout, but typically loaded directly when needed or statically. */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
    </div>
  );
}

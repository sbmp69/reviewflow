"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";

export default function PublicReviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orgId = params.orgId as string;
  const customerId = searchParams.get("c");

  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    async function fetchOrg() {
      if (!orgId) return;
      try {
        const docRef = doc(db, "organizations", orgId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrg(docSnap.data());
        } else {
          setError("Business not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Error loading business information.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrg();
  }, [orgId]);

  const handleReviewClick = async () => {
    if (!org?.google_review_url) {
      alert("This business hasn't configured their Google Review link yet.");
      return;
    }

    setIsRedirecting(true);

    try {
      // Record the click
      await addDoc(collection(db, "review_clicks"), {
        organization_id: orgId,
        customer_id: customerId || null,
        clicked_at: serverTimestamp(),
        user_agent: navigator.userAgent,
      });
    } catch (err) {
      console.error("Failed to track click:", err);
      // We still want to redirect even if tracking fails!
    }

    // Redirect
    window.location.href = org.google_review_url;
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (error || !org) {
    return <div className="flex h-screen items-center justify-center text-red-500">{error || "Not found."}</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-900">{org.name}</h1>
        
        <div className="space-y-4">
          <p className="text-lg font-medium text-gray-800">
            Thank you for visiting! ❤️
          </p>
          <p className="text-gray-600">
            We'd love to hear about your experience. Your honest feedback helps us improve and serve you better.
          </p>
        </div>

        <div className="pt-4">
          <Button 
            size="lg" 
            className="w-full text-lg h-14" 
            onClick={handleReviewClick}
            disabled={isRedirecting}
          >
            {isRedirecting ? "Redirecting..." : "Leave a Google Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}

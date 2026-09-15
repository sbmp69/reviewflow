"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, organizationId, loading } = useAuth();
  const router = useRouter();

  const [googleUrl, setGoogleUrl] = useState("");
  const [orgName, setOrgName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchOrg() {
      if (!organizationId) return;
      const docRef = doc(db, "organizations", organizationId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGoogleUrl(docSnap.data().google_review_url || "");
        setOrgName(docSnap.data().name || "");
      }
    }
    fetchOrg();
  }, [organizationId]);

  if (loading || !user) return <div className="p-8">Loading...</div>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) return;
    setIsSaving(true);
    setMessage("");

    try {
      const orgRef = doc(db, "organizations", organizationId);
      await updateDoc(orgRef, {
        google_review_url: googleUrl,
      });
      setMessage("Settings saved successfully.");
    } catch (err: any) {
      console.error(err);
      setMessage("Failed to save settings: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const reviewLink = typeof window !== "undefined" 
    ? `${window.location.origin}/r/${organizationId}` 
    : `https://reviewflow.in/r/${organizationId}`;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Google Review Configuration</CardTitle>
          <CardDescription>Connect your Google Business Profile review link.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSave}>
          <CardContent className="space-y-4">
            {message && <div className="text-sm bg-indigo-50 text-indigo-700 p-2 rounded">{message}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="googleUrl">Google Review URL</Label>
              <Input
                id="googleUrl"
                placeholder="https://g.page/r/..."
                value={googleUrl}
                onChange={(e) => setGoogleUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                You can get this from your Google Business Profile dashboard.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {organizationId && (
        <Card>
          <CardHeader>
            <CardTitle>QR Code & Public Link</CardTitle>
            <CardDescription>Share this QR code or link with customers.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="bg-white p-4 rounded-lg shadow-sm border inline-block">
              <QRCodeSVG value={reviewLink} size={200} />
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <Label>Your Public Review URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input readOnly value={reviewLink} className="bg-gray-50" />
                  <Button variant="outline" onClick={() => navigator.clipboard.writeText(reviewLink)}>
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  When customers visit this link, they'll see a customized request page before being sent to Google.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

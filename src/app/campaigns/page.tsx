"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

export default function CampaignsPage() {
  const { user, organizationId, loading } = useAuth();
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New campaign form state
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const [delayMinutes, setDelayMinutes] = useState(120);
  const [language, setLanguage] = useState("english");
  const [cooldownDays, setCooldownDays] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const fetchCampaigns = useCallback(async () => {
    if (!organizationId) return;
    try {
      const q = query(collection(db, "campaigns"), where("organization_id", "==", organizationId));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setCampaigns(fetched);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "campaigns"), {
        organization_id: organizationId,
        name,
        delay_minutes: Number(delayMinutes),
        language,
        cooldown_days: Number(cooldownDays),
        channel: "whatsapp",
        status: "active",
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      setShowNew(false);
      setName("");
      setDelayMinutes(120);
      setLanguage("english");
      setCooldownDays(30);
      fetchCampaigns();
    } catch (err) {
      console.error(err);
      alert("Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    try {
      await updateDoc(doc(db, "campaigns", id), {
        status: newStatus,
        updated_at: serverTimestamp(),
      });
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Button onClick={() => setShowNew(!showNew)}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {showNew && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Campaign</CardTitle>
            <CardDescription>Configure smart automation rules for your review requests.</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreate}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input id="name" required placeholder="e.g. Post-Purchase Follow-up" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Message Language</Label>
                  <select id="language" required className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50" value={language} onChange={e => setLanguage(e.target.value)}>
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="gujarati">Gujarati</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delay">Delay (minutes)</Label>
                  <Input id="delay" type="number" required min="0" value={delayMinutes} onChange={e => setDelayMinutes(Number(e.target.value))} />
                  <p className="text-xs text-gray-500">Wait this long after a sale before sending.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cooldown">Cooldown (days)</Label>
                  <Input id="cooldown" type="number" required min="0" value={cooldownDays} onChange={e => setCooldownDays(Number(e.target.value))} />
                  <p className="text-xs text-gray-500">Prevent spamming the same customer within this period.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="gap-4">
              <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Create Campaign"}</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Delay</TableHead>
              <TableHead>Cooldown</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No campaigns configured.
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="capitalize">{c.language || "English"}</TableCell>
                  <TableCell>{c.delay_minutes} mins</TableCell>
                  <TableCell>{c.cooldown_days || 30} days</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {c.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => toggleStatus(c.id, c.status)}>
                      {c.status === 'active' ? 'Pause' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

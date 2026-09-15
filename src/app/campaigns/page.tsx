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
import { Plus, MessageSquare } from "lucide-react";
import AppLayout from "@/components/AppLayout";

export default function CampaignsPage() {
  const { user, organizationId, loading } = useAuth();
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New campaign form state
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const [delayMinutes, setDelayMinutes] = useState(0); // Changed default to 0 (immediate)
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
      setDelayMinutes(0);
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

  if (loading || isLoading) return <div className="p-8 flex justify-center items-center h-screen bg-[#FAFAFC]">Loading...</div>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Campaigns</h1>
            <p className="text-slate-500 mt-2">Configure automation rules for your review requests.</p>
          </div>
          <Button onClick={() => setShowNew(!showNew)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {showNew && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Create Campaign</CardTitle>
              <CardDescription>Set up when and how you ask your customers for reviews.</CardDescription>
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
                    <p className="text-xs text-slate-500">Wait this long after adding a customer before sending. Set to 0 to send immediately.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cooldown">Cooldown (days)</Label>
                    <Input id="cooldown" type="number" required min="0" value={cooldownDays} onChange={e => setCooldownDays(Number(e.target.value))} />
                    <p className="text-xs text-slate-500">Prevent spamming the same customer within this period.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-4">
                <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isSubmitting ? "Saving..." : "Create Campaign"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-slate-600">Name</TableHead>
                <TableHead className="text-slate-600">Language</TableHead>
                <TableHead className="text-slate-600">Delay</TableHead>
                <TableHead className="text-slate-600">Cooldown</TableHead>
                <TableHead className="text-slate-600">Status</TableHead>
                <TableHead className="text-slate-600 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-slate-100 p-3 rounded-full mb-4">
                        <MessageSquare className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-lg font-medium text-slate-900">No campaigns configured</p>
                      <p className="mt-1">Create a campaign to define your automation rules.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-slate-900">{c.name}</TableCell>
                    <TableCell className="capitalize text-slate-600">{c.language || "English"}</TableCell>
                    <TableCell className="text-slate-600">{c.delay_minutes} mins</TableCell>
                    <TableCell className="text-slate-600">{c.cooldown_days || 30} days</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
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
    </AppLayout>
  );
}

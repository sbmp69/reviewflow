"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const { user, organizationId, loading } = useAuth();
  const router = useRouter();
  
  const [metrics, setMetrics] = useState({
    customers: 0,
    requestsSent: 0,
    requestsDelivered: 0,
    clicks: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadMetrics() {
      if (!organizationId) return;
      try {
        // 1. Total Customers
        const custQ = query(collection(db, "customers"), where("organization_id", "==", organizationId));
        const custSnap = await getCountFromServer(custQ);
        
        // 2. Sent Requests (using 'sent' + 'delivered' + 'read')
        const sentQ = query(collection(db, "review_requests"), where("organization_id", "==", organizationId), where("status", "in", ["sent", "delivered", "read"]));
        const sentSnap = await getCountFromServer(sentQ);
        
        // 3. Delivered Requests (Webhook confirmed)
        const delQ = query(collection(db, "review_requests"), where("organization_id", "==", organizationId), where("status", "in", ["delivered", "read"]));
        const delSnap = await getCountFromServer(delQ);
        
        // 4. Clicks
        const clicksQ = query(collection(db, "review_clicks"), where("organization_id", "==", organizationId));
        const clicksSnap = await getCountFromServer(clicksQ);

        setMetrics({
          customers: custSnap.data().count,
          requestsSent: sentSnap.data().count,
          requestsDelivered: delSnap.data().count,
          clicks: clicksSnap.data().count,
        });
      } catch (err) {
        console.error("Failed to load metrics", err);
      }
    }
    
    loadMetrics();
  }, [organizationId]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading || !user) {
    return <div className="p-8 flex justify-center items-center h-screen">Loading...</div>;
  }

  // Calculate Conversion Rate safely based on delivered messages
  const conversionRate = metrics.requestsDelivered > 0 
    ? ((metrics.clicks / metrics.requestsDelivered) * 100).toFixed(1) 
    : "0.0";

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => router.push('/customers')}>Customers</Button>
          <Button variant="outline" onClick={() => router.push('/campaigns')}>Campaigns</Button>
          <Button variant="outline" onClick={() => router.push('/settings')}>Settings</Button>
          <Button variant="outline" onClick={() => router.push('/billing')}>Billing</Button>
          <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="text-xl">Good Morning, <strong>{user.displayName || user.email}</strong> 👋</p>
          <p className="text-gray-500 mt-2">Here is how your automated review campaigns are performing.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Customers Contacted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.customers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Messages Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.requestsSent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Review Link Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.clicks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-50 border-dashed">
        <CardHeader className="flex flex-row items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          <CardTitle>Review Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="w-32 font-medium text-gray-700">Customers</div>
              <div className="flex-1">
                <div className="h-6 bg-blue-100 rounded-r-md" style={{ width: '100%' }}>
                  <span className="pl-2 text-sm font-bold text-blue-800 leading-6">{metrics.customers}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-32 font-medium text-gray-700">Sent</div>
              <div className="flex-1">
                <div className="h-6 bg-indigo-100 rounded-r-md transition-all duration-1000" style={{ width: metrics.customers > 0 ? `${(metrics.requestsSent / metrics.customers) * 100}%` : '0%' }}>
                  <span className="pl-2 text-sm font-bold text-indigo-800 leading-6">{metrics.requestsSent}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-32 font-medium text-gray-700">Delivered <span className="text-[10px] bg-green-200 text-green-800 px-1 rounded ml-1">Live</span></div>
              <div className="flex-1">
                <div className="h-6 bg-emerald-100 rounded-r-md transition-all duration-1000" style={{ width: metrics.customers > 0 ? `${(metrics.requestsDelivered / metrics.customers) * 100}%` : '0%' }}>
                  <span className="pl-2 text-sm font-bold text-emerald-800 leading-6">{metrics.requestsDelivered}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-32 font-medium text-gray-700">Clicked</div>
              <div className="flex-1">
                <div className="h-6 bg-purple-100 rounded-r-md transition-all duration-1000" style={{ width: metrics.customers > 0 ? `${(metrics.clicks / metrics.customers) * 100}%` : '0%' }}>
                  <span className="pl-2 text-sm font-bold text-purple-800 leading-6">{metrics.clicks}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

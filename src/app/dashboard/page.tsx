"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Send, CheckCircle2, MousePointerClick } from "lucide-react";
import AppLayout from "@/components/AppLayout";

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
        const custQ = query(collection(db, "customers"), where("organization_id", "==", organizationId));
        const custSnap = await getCountFromServer(custQ);
        
        const sentQ = query(collection(db, "review_requests"), where("organization_id", "==", organizationId), where("status", "in", ["sent", "delivered", "read"]));
        const sentSnap = await getCountFromServer(sentQ);
        
        const delQ = query(collection(db, "review_requests"), where("organization_id", "==", organizationId), where("status", "in", ["delivered", "read"]));
        const delSnap = await getCountFromServer(delQ);
        
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

  if (loading || !user) {
    return <div className="p-8 flex justify-center items-center h-screen bg-[#FAFAFC]">Loading...</div>;
  }

  const conversionRate = metrics.requestsDelivered > 0 
    ? ((metrics.clicks / metrics.requestsDelivered) * 100).toFixed(1) 
    : "0.0";

  return (
    <AppLayout>
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user.displayName?.split(' ')[0] || "there"} 👋
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Here's what's happening with your review campaigns today.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-900">{metrics.customers}</div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Messages Sent</CardTitle>
              <Send className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-900">{metrics.requestsSent}</div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Review Link Clicks</CardTitle>
              <MousePointerClick className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-slate-900">{metrics.clicks}</div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 shadow-sm bg-blue-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Conversion Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-blue-700">{conversionRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Funnel Chart */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-700" />
              </div>
              <CardTitle className="text-lg">Review Pipeline</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="flex flex-col space-y-6 max-w-4xl">
              
              {/* Funnel Step 1 */}
              <div className="flex items-center">
                <div className="w-32 font-medium text-slate-600 text-sm uppercase tracking-wider">Customers</div>
                <div className="flex-1 ml-4">
                  <div className="h-10 bg-slate-100 rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-lg transition-all" style={{ width: '100%' }}></div>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-white drop-shadow-sm">{metrics.customers}</span>
                  </div>
                </div>
              </div>
              
              {/* Funnel Step 2 */}
              <div className="flex items-center">
                <div className="w-32 font-medium text-slate-600 text-sm uppercase tracking-wider">Sent</div>
                <div className="flex-1 ml-4">
                  <div className="h-10 bg-slate-100 rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-indigo-500 rounded-lg transition-all duration-1000" style={{ width: metrics.customers > 0 ? `${(metrics.requestsSent / metrics.customers) * 100}%` : '0%' }}></div>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-white drop-shadow-sm">{metrics.requestsSent}</span>
                  </div>
                </div>
              </div>
              
              {/* Funnel Step 3 */}
              <div className="flex items-center">
                <div className="w-32 font-medium text-slate-600 text-sm uppercase tracking-wider flex items-center gap-2">
                  Delivered 
                  <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">LIVE</span>
                </div>
                <div className="flex-1 ml-4">
                  <div className="h-10 bg-slate-100 rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-lg transition-all duration-1000" style={{ width: metrics.customers > 0 ? `${(metrics.requestsDelivered / metrics.customers) * 100}%` : '0%' }}></div>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-white drop-shadow-sm">{metrics.requestsDelivered}</span>
                  </div>
                </div>
              </div>
              
              {/* Funnel Step 4 */}
              <div className="flex items-center">
                <div className="w-32 font-medium text-slate-600 text-sm uppercase tracking-wider">Clicked</div>
                <div className="flex-1 ml-4">
                  <div className="h-10 bg-slate-100 rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-purple-500 rounded-lg transition-all duration-1000" style={{ width: metrics.customers > 0 ? `${(metrics.clicks / metrics.customers) * 100}%` : '0%' }}></div>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-white drop-shadow-sm">{metrics.clicks}</span>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Users, MessageSquare, CreditCard, Activity } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalCustomers: 0,
    totalMessages: 0,
    estimatedMRR: 0,
  });
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // SECURE THIS PAGE: Only allow specific admin email
  const ADMIN_EMAIL = "ajudiameet11@gmail.com"; 

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.email !== ADMIN_EMAIL) {
        router.push("/dashboard"); // Redirect normal users away
      } else {
        setIsAdmin(true);
        fetchAdminData();
      }
    }
  }, [user, loading, router]);

  const fetchAdminData = async () => {
    try {
      // Fetch Organizations
      const orgsSnapshot = await getDocs(collection(db, "organizations"));
      const orgs = orgsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Fetch Customers (Global)
      const customersSnapshot = await getDocs(collection(db, "customers"));
      
      // Fetch Review Requests (Global)
      const requestsSnapshot = await getDocs(collection(db, "review_requests"));

      setStats({
        totalBusinesses: orgs.length,
        totalCustomers: customersSnapshot.size,
        totalMessages: requestsSnapshot.size,
        estimatedMRR: orgs.length * 999, // Basic mock MRR estimation (₹999/org)
      });

      setBusinesses(orgs);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (loading || (isAdmin && isLoadingData)) return <div className="p-8">Loading Admin Panel...</div>;
  if (!isAdmin) return null; // Fallback if redirect is pending

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#FAFAFC] min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-100 p-2 rounded-lg">
          <Activity className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin</h1>
          <p className="text-sm text-gray-500">Platform Overview & Metrics</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats.totalBusinesses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Requests Processed</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats.totalMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Estimated MRR</CardTitle>
            <CreditCard className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">₹{stats.estimatedMRR.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Businesses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization Name</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businesses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No businesses registered yet.
                  </TableCell>
                </TableRow>
              ) : (
                businesses.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-bold">{org.name}</TableCell>
                    <TableCell className="text-xs text-gray-500 font-mono">{org.id}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {org.created_at?.toDate ? org.created_at.toDate().toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider">
                        Active
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

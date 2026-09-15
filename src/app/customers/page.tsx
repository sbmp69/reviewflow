"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Upload, Users } from "lucide-react";
import AppLayout from "@/components/AppLayout";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  consent_status: string;
  created_at: any;
}

export default function CustomersPage() {
  const { user, organizationId, loading } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchCustomers() {
      if (!organizationId) return;
      try {
        const q = query(
          collection(db, "customers"),
          where("organization_id", "==", organizationId)
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Customer[];
        
        // Sort in memory to avoid needing a Firestore composite index
        fetched.sort((a, b) => {
          const dateA = a.created_at?.toDate ? a.created_at.toDate().getTime() : 0;
          const dateB = b.created_at?.toDate ? b.created_at.toDate().getTime() : 0;
          return dateB - dateA;
        });
        
        setCustomers(fetched);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (organizationId) {
      fetchCustomers();
    }
  }, [organizationId]);

  if (loading || isLoading) return <div className="p-8 flex justify-center items-center h-screen bg-[#FAFAFC]">Loading...</div>;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customers</h1>
            <p className="text-slate-500 mt-2">Manage your customer list and add new contacts.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/customers/import">
              <Button variant="outline" className="bg-white">
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
            </Link>
            <Link href="/customers/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-slate-600">Name</TableHead>
                <TableHead className="text-slate-600">Phone</TableHead>
                <TableHead className="text-slate-600">Email</TableHead>
                <TableHead className="text-slate-600">Consent</TableHead>
                <TableHead className="text-slate-600">Added Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-slate-100 p-3 rounded-full mb-4">
                        <Users className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-lg font-medium text-slate-900">No customers yet</p>
                      <p className="mt-1">Add a customer to start sending review requests.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-slate-900">{c.name}</TableCell>
                    <TableCell className="text-slate-600">{c.phone}</TableCell>
                    <TableCell className="text-slate-600">{c.email || "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.consent_status === 'granted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                        {c.consent_status}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {c.created_at?.toDate ? c.created_at.toDate().toLocaleDateString() : "-"}
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

"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { collection, doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import Papa from "papaparse";

export default function ImportCustomersPage() {
  const { user, organizationId, loading } = useAuth();
  const router = useRouter();

  const [csvData, setCsvData] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState("");

  if (loading || !user) return <div className="p-8">Loading...</div>;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Map the results to ensure basic fields exist
        const mappedData = results.data.map((row: any) => ({
          name: row.name || row.Name || "",
          phone: row.phone || row.Phone || "",
          purchase_amount: row.purchase_amount || row['Purchase Amount'] || "",
          purchase_date: row.purchase_date || row['Purchase Date'] || "",
        })).filter((row) => row.name && row.phone);
        
        setCsvData(mappedData);
      },
      error: (error) => {
        setError("Failed to parse CSV: " + error.message);
      }
    });
  };

  const handleImport = async () => {
    if (!organizationId) {
      setError("Organization not found.");
      return;
    }

    if (csvData.length === 0) {
      setError("No valid data to import.");
      return;
    }

    setIsImporting(true);
    setError("");

    try {
      // Create batches of 500 (Firestore limit is 500 writes per batch)
      const batches = [];
      let batch = writeBatch(db);
      let operationCount = 0;

      for (const row of csvData) {
        const customerRef = doc(collection(db, "customers"));
        batch.set(customerRef, {
          organization_id: organizationId,
          name: row.name,
          phone: row.phone,
          consent_status: "granted", // Assume granted for imported POS data by default
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
        operationCount++;

        if (row.purchase_amount && parseFloat(row.purchase_amount) > 0) {
          const txRef = doc(collection(db, "transactions"));
          batch.set(txRef, {
            organization_id: organizationId,
            customer_id: customerRef.id,
            amount: parseFloat(row.purchase_amount),
            currency: "INR",
            source: "csv",
            purchased_at: row.purchase_date ? new Date(row.purchase_date) : serverTimestamp(),
            created_at: serverTimestamp(),
          });
          operationCount++;
        }

        if (operationCount >= 490) {
          batches.push(batch);
          batch = writeBatch(db);
          operationCount = 0;
        }
      }

      if (operationCount > 0) {
        batches.push(batch);
      }

      for (const b of batches) {
        await b.commit();
      }

      router.push("/customers");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to import customers");
      setIsImporting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/customers" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Customers
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Import Customers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="text-red-500 bg-red-50 p-2 rounded text-sm">{error}</div>}
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-sm text-gray-600 mb-4">
              <label htmlFor="csv-upload" className="cursor-pointer text-indigo-600 font-semibold hover:underline">
                Click to upload
              </label>{" "}
              or drag and drop your CSV file here.
            </div>
            <p className="text-xs text-gray-500">Expected columns: name, phone, purchase_amount, purchase_date</p>
            <input 
              id="csv-upload" 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </div>

          {csvData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Preview ({csvData.length} valid rows)</h3>
              <div className="border rounded-md overflow-x-auto max-h-64">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.slice(0, 10).map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>{row.purchase_amount}</TableCell>
                        <TableCell>{row.purchase_date}</TableCell>
                      </TableRow>
                    ))}
                    {csvData.length > 10 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-2">
                          ... and {csvData.length - 10} more rows
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setCsvData([])}>Clear</Button>
          <Button onClick={handleImport} disabled={csvData.length === 0 || isImporting}>
            {isImporting ? "Importing..." : `Import ${csvData.length} Customers`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

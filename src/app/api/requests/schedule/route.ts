import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { inngest } from "@/inngest/client";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const { organizationId, customerId, transactionId } = await req.json();

    if (!organizationId || !customerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Find an active campaign
    const campaignsSnapshot = await adminDb.collection("campaigns")
      .where("organization_id", "==", organizationId)
      .where("status", "==", "active")
      .limit(1)
      .get();

    if (campaignsSnapshot.empty) {
      return NextResponse.json({ message: "No active campaigns found" }, { status: 200 });
    }

    const campaign = campaignsSnapshot.docs[0].data();
    const campaignId = campaignsSnapshot.docs[0].id;

    // 2. Create the review_request document
    const reqRef = adminDb.collection("review_requests").doc();
    await reqRef.set({
      organization_id: organizationId,
      customer_id: customerId,
      campaign_id: campaignId,
      transaction_id: transactionId || null,
      status: "scheduled",
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    // 3. Trigger Inngest to handle the delay and sending
    await inngest.send({
      name: "review/request.scheduled",
      data: {
        organizationId,
        customerId,
        transactionId,
        reviewRequestId: reqRef.id,
        delayMinutes: campaign.delay_minutes || 0,
      }
    });

    return NextResponse.json({ message: "Scheduled successfully", requestId: reqRef.id }, { status: 200 });
  } catch (error: any) {
    console.error("Scheduling error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

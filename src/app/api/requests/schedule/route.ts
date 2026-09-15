import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { inngest } from "@/inngest/client";
import { FieldValue } from "firebase-admin/firestore";
import { sendWhatsAppTemplate } from "@/lib/whatsapp/send";

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
    const delayMinutes = campaign.delay_minutes || 0;
    const language = campaign.language || "english";

    // 2. Create the review_request document
    const reqRef = adminDb.collection("review_requests").doc();
    await reqRef.set({
      organization_id: organizationId,
      customer_id: customerId,
      campaign_id: campaignId,
      transaction_id: transactionId || null,
      status: delayMinutes === 0 ? "processing" : "scheduled",
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    // 3. If delay is 0, send immediately and bypass Inngest (to prevent Inngest sync issues during instant testing)
    if (delayMinutes === 0) {
      const customerDoc = await adminDb.collection("customers").doc(customerId).get();
      const customer = customerDoc.data();
      
      if (customer && customer.consent_status === "granted" && customer.phone) {
        // Map language
        let languageCode = "en_US";
        if (language === "hindi") languageCode = "hi";
        if (language === "gujarati") languageCode = "gu";

        try {
          // Send direct
          const sendResult = await sendWhatsAppTemplate(customer.phone, "review_request", languageCode);
          
          // Update DB
          await reqRef.update({
            status: "sent",
            sent_at: FieldValue.serverTimestamp(),
            channel: "whatsapp",
            message_id: sendResult.messageId
          });
          
          await adminDb.collection("customers").doc(customerId).update({
            last_review_request_at: FieldValue.serverTimestamp()
          });
          
          return NextResponse.json({ message: "Sent instantly via direct API bypass", requestId: reqRef.id }, { status: 200 });
        } catch (err: any) {
          console.error("Direct send failed:", err);
          await reqRef.update({ status: "failed", reason: err.message });
          return NextResponse.json({ error: "WhatsApp API failed: " + err.message }, { status: 500 });
        }
      } else {
        await reqRef.update({ status: "cancelled", reason: "no_consent_or_phone" });
        return NextResponse.json({ error: "Customer lacks consent or phone number" }, { status: 400 });
      }
    }

    // 4. Trigger Inngest for delayed campaigns
    await inngest.send({
      name: "review/request.scheduled",
      data: {
        organizationId,
        customerId,
        transactionId,
        reviewRequestId: reqRef.id,
        delayMinutes,
        cooldownDays: campaign.cooldown_days || 30,
        language,
      }
    });

    return NextResponse.json({ message: "Scheduled successfully", requestId: reqRef.id }, { status: 200 });
  } catch (error: any) {
    console.error("Scheduling error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

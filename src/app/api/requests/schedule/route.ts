import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { inngest } from "@/inngest/client";
import { FieldValue } from "firebase-admin/firestore";
import { sendWhatsAppTemplate } from "@/lib/whatsapp/send";

export async function POST(req: Request) {
  try {
    console.log("[Schedule API] Starting request...");
    const body = await req.json();
    console.log("[Schedule API] Body parsed:", body);
    
    const { organizationId, customerId, transactionId } = body;

    if (!organizationId || !customerId) {
      console.error("[Schedule API] Missing fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Initialize DB
    console.log("[Schedule API] Getting Admin DB...");
    const db = getAdminDb();
    console.log("[Schedule API] Admin DB acquired.");

    // 1. Find an active campaign
    console.log(`[Schedule API] Looking for active campaign for org: ${organizationId}`);
    const campaignsSnapshot = await db.collection("campaigns")
      .where("organization_id", "==", organizationId)
      .where("status", "==", "active")
      .limit(1)
      .get();

    if (campaignsSnapshot.empty) {
      console.log("[Schedule API] No active campaigns found");
      return NextResponse.json({ message: "No active campaigns found" }, { status: 200 });
    }

    const campaign = campaignsSnapshot.docs[0].data();
    const campaignId = campaignsSnapshot.docs[0].id;
    const delayMinutes = campaign.delay_minutes || 0;
    const language = campaign.language || "english";

    console.log(`[Schedule API] Campaign found: ${campaignId}, Delay: ${delayMinutes}`);

    // 2. Create the review_request document
    console.log("[Schedule API] Creating review request doc...");
    const reqRef = db.collection("review_requests").doc();
    await reqRef.set({
      organization_id: organizationId,
      customer_id: customerId,
      campaign_id: campaignId,
      transaction_id: transactionId || null,
      status: delayMinutes === 0 ? "processing" : "scheduled",
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });
    console.log(`[Schedule API] Review request created: ${reqRef.id}`);

    // 3. If delay is 0, send immediately and bypass Inngest
    if (delayMinutes === 0) {
      console.log("[Schedule API] Delay is 0, executing instant bypass...");
      const customerDoc = await db.collection("customers").doc(customerId).get();
      const customer = customerDoc.data();
      
      if (customer && customer.consent_status === "granted" && customer.phone) {
        console.log(`[Schedule API] Customer eligible. Phone: ${customer.phone}`);
        // Map language
        let languageCode = "en_US";
        if (language === "hindi") languageCode = "hi";
        if (language === "gujarati") languageCode = "gu";

        try {
          // Send direct
          console.log(`[Schedule API] Calling sendWhatsAppTemplate...`);
          const sendResult = await sendWhatsAppTemplate(customer.phone, "review_request", languageCode);
          console.log(`[Schedule API] WhatsApp sent! Result:`, sendResult);
          
          // Update DB
          await reqRef.update({
            status: "sent",
            sent_at: FieldValue.serverTimestamp(),
            channel: "whatsapp",
            message_id: sendResult.messageId
          });
          
          await db.collection("customers").doc(customerId).update({
            last_review_request_at: FieldValue.serverTimestamp()
          });
          
          console.log(`[Schedule API] Instant bypass complete.`);
          return NextResponse.json({ message: "Sent instantly via direct API bypass", requestId: reqRef.id }, { status: 200 });
        } catch (err: any) {
          console.error("[Schedule API] Direct send failed:", err);
          await reqRef.update({ status: "failed", reason: err.message || String(err) });
          return NextResponse.json({ error: "WhatsApp API failed: " + (err.message || String(err)) }, { status: 500 });
        }
      } else {
        console.log(`[Schedule API] Customer ineligible for bypass. Consent: ${customer?.consent_status}, Phone: ${customer?.phone}`);
        await reqRef.update({ status: "cancelled", reason: "no_consent_or_phone" });
        return NextResponse.json({ error: "Customer lacks consent or phone number" }, { status: 400 });
      }
    }

    // 4. Trigger Inngest for delayed campaigns
    console.log(`[Schedule API] Delay > 0, sending to Inngest...`);
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
    console.log(`[Schedule API] Sent to Inngest successfully.`);

    return NextResponse.json({ message: "Scheduled successfully", requestId: reqRef.id }, { status: 200 });
  } catch (error: any) {
    console.error("[Schedule API] UNHANDLED Scheduling error:", error);
    return NextResponse.json({ error: error.message || "Unknown internal error" }, { status: 500 });
  }
}

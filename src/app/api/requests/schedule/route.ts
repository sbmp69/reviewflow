export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { inngest } from "@/inngest/client";

// Initialize inside the route safely
let app: any;
try {
  if (!getApps().length) {
    const rawKey = process.env.FIREBASE_PRIVATE_KEY || "";
    const formattedKey = rawKey.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedKey,
      }),
    });
  } else {
    app = getApps()[0];
  }
} catch (e: any) {
  console.error("Critical Firebase Init Failure in Route:", e);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { organizationId, customerId, transactionId } = body;

    if (!organizationId || !customerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!app) {
      return NextResponse.json({ error: "Firebase Admin failed to initialize on server" }, { status: 500 });
    }

    const db = getFirestore(app);

    // 1. Find an active campaign
    let campaignsSnapshot;
    try {
      campaignsSnapshot = await db.collection("campaigns")
        .where("organization_id", "==", organizationId)
        .where("status", "==", "active")
        .limit(1)
        .get();
    } catch (e: any) {
      return NextResponse.json({ error: "Firebase DB Error: " + e.message }, { status: 500 });
    }

    if (campaignsSnapshot.empty) {
      return NextResponse.json({ message: "No active campaigns found" }, { status: 200 });
    }

    const campaign = campaignsSnapshot.docs[0].data();
    const campaignId = campaignsSnapshot.docs[0].id;
    const delayMinutes = campaign.delay_minutes || 0;
    const language = campaign.language || "english";

    // 2. Create the review_request document
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

    // 3. If delay is 0, send immediately and bypass Inngest
    if (delayMinutes === 0 || delayMinutes === "0") {
      const customerDoc = await db.collection("customers").doc(customerId).get();
      const customer = customerDoc.data();
      
      if (customer && customer.consent_status === "granted" && customer.phone) {
        
        // Inline WhatsApp sending to avoid import crashes
        let languageCode = "en_US";
        if (language === "hindi") languageCode = "hi";
        if (language === "gujarati") languageCode = "gu";

        const token = process.env.WHATSAPP_ACCESS_TOKEN;
        const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

        if (!token || !phoneId) {
          await reqRef.update({ status: "failed", reason: "Missing WhatsApp Credentials" });
          return NextResponse.json({ error: "Missing WhatsApp Credentials on Server" }, { status: 500 });
        }

        const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;
        const payload = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: customer.phone.replace(/[^0-9]/g, ""),
          type: "template",
          template: { name: "review_request", language: { code: languageCode }, components: [] }
        };

        const response = await fetch(url, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const resData = await response.json();

        if (!response.ok) {
          const errMsg = resData.error?.message || "Unknown error";
          await reqRef.update({ status: "failed", reason: errMsg });
          return NextResponse.json({ error: "WhatsApp Meta API Error: " + errMsg }, { status: 500 });
        }

        // Success
        await reqRef.update({
          status: "sent",
          sent_at: FieldValue.serverTimestamp(),
          channel: "whatsapp",
          message_id: resData.messages?.[0]?.id || "unknown"
        });
        
        await db.collection("customers").doc(customerId).update({
          last_review_request_at: FieldValue.serverTimestamp()
        });
        
        return NextResponse.json({ message: "Sent instantly", requestId: reqRef.id }, { status: 200 });
      } else {
        await reqRef.update({ status: "cancelled", reason: "no_consent_or_phone" });
        return NextResponse.json({ error: "Customer lacks consent or phone number" }, { status: 400 });
      }
    }

    // 4. Trigger Inngest for delayed campaigns
    try {
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
    } catch (e: any) {
      return NextResponse.json({ error: "Inngest API Error: " + e.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Scheduled successfully", requestId: reqRef.id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Global API Error: " + error.message }, { status: 500 });
  }
}

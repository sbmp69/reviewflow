import { NextResponse } from "next/server";

// Meta verification - NO DEPENDENCIES
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode && token) {
      if (mode === "subscribe" && token === verifyToken) {
        return new NextResponse(challenge, { status: 200 });
      }
    }
    return NextResponse.json({ error: "Unauthorized", receivedToken: token, expectedToken: verifyToken ? "set" : "missing" }, { status: 403 });
  } catch (error: any) {
    return NextResponse.json({ error: "Crash", message: error.message || String(error) }, { status: 500 });
  }
}

// Meta Webhook Events
export async function POST(req: Request) {
  try {
    // Dynamically import to prevent top-level crashes
    const { adminDb } = await import("@/lib/firebase/admin");
    const { FieldValue } = await import("firebase-admin/firestore");

    const body = await req.json();

    if (body.object !== "whatsapp_business_account") {
      return NextResponse.json({ error: "Invalid object" }, { status: 404 });
    }

    // Process entries
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.value.statuses) {
          for (const status of change.value.statuses) {
            const messageId = status.id;
            const messageStatus = status.status; // sent, delivered, read, failed

            // Log event
            await adminDb.collection("message_events").add({
              provider: "whatsapp",
              provider_message_id: messageId,
              event_type: messageStatus,
              metadata: status,
              created_at: FieldValue.serverTimestamp(),
            });

            // Find the review request that matches this message_id
            const reqQuery = await adminDb.collection("review_requests")
              .where("message_id", "==", messageId)
              .limit(1)
              .get();

            if (!reqQuery.empty) {
              const reqRef = reqQuery.docs[0].ref;
              const updateData: any = { status: messageStatus };
              
              if (messageStatus === "delivered") {
                updateData.delivered_at = FieldValue.serverTimestamp();
              }
              
              await reqRef.update(updateData);
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

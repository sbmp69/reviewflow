import { inngest } from "./client";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendWhatsAppTemplate } from "@/lib/whatsapp/send";

export const processReviewRequest = inngest.createFunction(
  { id: "process-review-request" },
  { event: "review/request.scheduled" },
  async ({ event, step }) => {
    const { organizationId, customerId, transactionId, delayMinutes, reviewRequestId } = event.data;

    if (delayMinutes > 0) {
      await step.sleep("wait-for-delay", `${delayMinutes}m`);
    }

    await step.run("update-status-processing", async () => {
      const reqRef = adminDb.collection("review_requests").doc(reviewRequestId);
      await reqRef.update({ status: "processing" });
    });

    const sendResult = await step.run("send-whatsapp", async () => {
      // Fetch customer details to get the phone number
      const customerDoc = await adminDb.collection("customers").doc(customerId).get();
      const customer = customerDoc.data();

      if (!customer || !customer.phone) {
        throw new Error("Customer or phone number not found.");
      }

      if (customer.consent_status !== "granted") {
        throw new Error("Customer has revoked consent.");
      }

      // We wrap the real API call in a try-catch for local testing gracefulness
      try {
        const result = await sendWhatsAppTemplate(customer.phone);
        return result;
      } catch (err: any) {
        // If config is missing (e.g. local dev without env vars), fallback to simulated
        if (err.message.includes("WhatsApp configuration missing")) {
          console.log(`[Local Mock] WhatsApp config missing. Simulating send to ${customer.phone}`);
          return { success: true, messageId: "simulated_" + Date.now() };
        }
        throw err; // Real API errors should trigger Inngest retries
      }
    });

    await step.run("update-status-sent", async () => {
      const reqRef = adminDb.collection("review_requests").doc(reviewRequestId);
      await reqRef.update({ 
        status: "sent", 
        sent_at: FieldValue.serverTimestamp(),
        channel: "whatsapp",
        message_id: sendResult.messageId
      });
    });

    return { success: true, reviewRequestId };
  }
);

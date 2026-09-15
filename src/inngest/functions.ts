import { inngest } from "./client";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export const processReviewRequest = inngest.createFunction(
  { id: "process-review-request" },
  { event: "review/request.scheduled" },
  async ({ event, step }) => {
    const { organizationId, customerId, transactionId, delayMinutes, reviewRequestId } = event.data;

    // Step 1: Wait for the configured delay
    if (delayMinutes > 0) {
      await step.sleep("wait-for-delay", `${delayMinutes}m`);
    }

    // Step 2: Update status to processing
    await step.run("update-status-processing", async () => {
      const reqRef = adminDb.collection("review_requests").doc(reviewRequestId);
      await reqRef.update({ status: "processing" });
    });

    // Step 3: Send WhatsApp Message (To be implemented in Phase 5)
    const sendResult = await step.run("send-whatsapp", async () => {
      console.log(`[Phase 4 Mock] Sending WhatsApp to customer ${customerId} for org ${organizationId}...`);
      // Simulating external API call
      return { success: true, messageId: "simulated_msg_" + Date.now() };
    });

    // Step 4: Update status to sent
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

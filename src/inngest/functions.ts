import { inngest } from "./client";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendWhatsAppTemplate } from "@/lib/whatsapp/send";

export const processReviewRequest = inngest.createFunction(
  { id: "process-review-request", event: "review/request.scheduled" },
  async ({ event, step }) => {
    const { organizationId, customerId, transactionId, delayMinutes, cooldownDays, language, reviewRequestId } = event.data;

    if (delayMinutes > 0) {
      await step.sleep("wait-for-delay", `${delayMinutes}m`);
    }

    // Smart Sending: Check Cooldown
    const isEligible = await step.run("check-cooldown", async () => {
      const customerDoc = await adminDb.collection("customers").doc(customerId).get();
      const customer = customerDoc.data();
      if (!customer) return false;

      // Ensure customer gave consent
      if (customer.consent_status !== "granted") {
        console.log(`Customer ${customerId} does not have granted consent.`);
        return false;
      }

      // Check last review request time
      if (customer.last_review_request_at) {
        const lastRequestDate = customer.last_review_request_at.toDate();
        const daysSinceLastRequest = (Date.now() - lastRequestDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastRequest < cooldownDays) {
          console.log(`Skipping: Customer ${customerId} was contacted ${daysSinceLastRequest.toFixed(1)} days ago (cooldown: ${cooldownDays} days).`);
          return false;
        }
      }
      return true;
    });

    if (!isEligible) {
      await step.run("update-status-skipped", async () => {
        const reqRef = adminDb.collection("review_requests").doc(reviewRequestId);
        await reqRef.update({ status: "cancelled", reason: "cooldown_or_consent" });
      });
      return { success: false, reason: "cooldown_or_consent", reviewRequestId };
    }

    await step.run("update-status-processing", async () => {
      const reqRef = adminDb.collection("review_requests").doc(reviewRequestId);
      await reqRef.update({ status: "processing" });
    });

    const sendResult = await step.run("send-whatsapp", async () => {
      const customerDoc = await adminDb.collection("customers").doc(customerId).get();
      const customer = customerDoc.data();
      if (!customer || !customer.phone) throw new Error("Customer phone not found.");

      // Map language to WhatsApp language code
      let languageCode = "en_US";
      if (language === "hindi") languageCode = "hi";
      if (language === "gujarati") languageCode = "gu";

      try {
        const result = await sendWhatsAppTemplate(customer.phone, "review_request", languageCode);
        
        // Update customer's last contacted timestamp after successful send
        await adminDb.collection("customers").doc(customerId).update({
          last_review_request_at: FieldValue.serverTimestamp()
        });

        return result;
      } catch (err: any) {
        if (err.message.includes("WhatsApp configuration missing")) {
          console.log(`[Local Mock] Simulated send to ${customer.phone} in ${languageCode}`);
          await adminDb.collection("customers").doc(customerId).update({
            last_review_request_at: FieldValue.serverTimestamp()
          });
          return { success: true, messageId: "simulated_" + Date.now() };
        }
        throw err;
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

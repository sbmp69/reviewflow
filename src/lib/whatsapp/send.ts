export async function sendWhatsAppTemplate(
  phone: string,
  templateName: string = "review_request",
  languageCode: string = "en_US",
  variables: any[] = []
) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId) {
    throw new Error("WhatsApp configuration missing from environment.");
  }

  const url = `https://graph.facebook.com/v17.0/${phoneId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phone.replace(/[^0-9]/g, ""),
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components: variables.length > 0 ? [
        {
          type: "body",
          parameters: variables
        }
      ] : []
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to send WhatsApp message.");
  }

  return {
    success: true,
    messageId: data.messages?.[0]?.id 
  };
}

import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { planId, organizationId } = await req.json();

    // Standard pricing as per PRD
    const plans: Record<string, number> = {
      starter: 49900, // ₹499 in paise
      growth: 99900,  // ₹999 in paise
      pro: 199900,    // ₹1,999 in paise
    };

    const amount = plans[planId];
    if (!amount) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // Gracefully handle local dev without credentials
    if (!key_id || !key_secret) {
      console.log("[Mock] Generating Razorpay Order ID because credentials are missing.");
      return NextResponse.json({ 
        orderId: "order_mock_" + Date.now(), 
        amount, 
        currency: "INR",
        mocked: true
      }, { status: 200 });
    }

    const instance = new Razorpay({ key_id, key_secret });

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_org_${organizationId.substring(0,8)}_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    return NextResponse.json({ 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency 
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

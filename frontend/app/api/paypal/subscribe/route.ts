import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebase"
import { doc, setDoc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { uid, email, planId } = await req.json();

    // 1️⃣ Call PayPal to create subscription
    const resp = await fetch("https://api-m.sandbox.paypal.com/v1/billing/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        plan_id: planId, // Example: "P-123456789"
        subscriber: { email_address: email },
        application_context: {
          brand_name: "MyApp",
          user_action: "SUBSCRIBE_NOW",
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/accountSettings`,
        },
      }),
    });

    if (!resp.ok) {
      throw new Error(`PayPal subscription failed: ${resp.status}`);
    }

    const data = await resp.json();

    // 2️⃣ Save PayPal subscription ID in Firestore
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      email,
      subscription: "pro",
      subscriptionStatus: "pending",
      paypalSubscriptionId: data.id, // <--- 🔹 Store PayPal subscriptionId
      subscribedAt: new Date().toISOString(),
    }, { merge: true });

    // 3️⃣ Return approval link to frontend
    return NextResponse.json({ approvalUrl: data.links.find((l: any) => l.rel === "approve").href }, { status: 200 });

  } catch (err: any) {
    console.error("PayPal Subscribe Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

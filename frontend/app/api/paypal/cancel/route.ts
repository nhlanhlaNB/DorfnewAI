import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Lookup the subscription ID for this user
    // ⚠️ You must save PayPal's subscriptionId in Firestore when creating a subscription
    // Example: users/{uid}.paypalSubscriptionId
    const subscriptionId = "REPLACE_WITH_LOOKUP"; 

    // Call PayPal API to cancel subscription
    const resp = await fetch(
      `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ reason: "User requested cancellation" }),
      }
    );

    if (!resp.ok) {
      throw new Error(`PayPal cancel failed: ${resp.status}`);
    }

    return NextResponse.json({ message: "Subscription cancelled" }, { status: 200 });
  } catch (err: any) {
    console.error("Cancel API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

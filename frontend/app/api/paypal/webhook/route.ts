import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("PayPal Webhook:", JSON.stringify(body, null, 2));

    const eventType = body.event_type;
    const email = body.resource?.payer?.email_address;

    if (!email) {
      return NextResponse.json({ error: "No email in webhook" }, { status: 400 });
    }

    const userRef = doc(db, "users", email.toLowerCase());

    if (eventType === "PAYMENT.SALE.COMPLETED" || eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      await updateDoc(userRef, {
        subscription: "pro",
        subscriptionStatus: "active",
        subscribedAt: new Date().toISOString(),
      });
      return NextResponse.json({ message: "User upgraded to PRO" }, { status: 200 });
    }

    if (eventType === "BILLING.SUBSCRIPTION.CANCELLED" || eventType === "BILLING.SUBSCRIPTION.EXPIRED") {
      await updateDoc(userRef, {
        subscription: "free",
        subscriptionStatus: "cancelled",
        cancelledAt: new Date().toISOString(),
      });
      return NextResponse.json({ message: "User downgraded to FREE" }, { status: 200 });
    }

    return NextResponse.json({ message: "Event ignored" }, { status: 200 });
  } catch (error: any) {
    console.error("PayPal Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

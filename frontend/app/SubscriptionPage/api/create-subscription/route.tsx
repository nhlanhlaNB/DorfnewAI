import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(request: Request) {
  try {
    const { priceId, paymentMethodId } = await request.json();

    // Validate priceId
    const validPriceIds = [
      "prod_SNxjtIk06iofey",
      "prod_SNxlf5Yt5D5ZiR",
      "prod_SNxmEo6HWFZzQp",
    ];
    if (!priceId || !paymentMethodId || !validPriceIds.includes(priceId)) {
      return NextResponse.json({ error: "Invalid priceId or paymentMethodId" }, { status: 400 });
    }

    // Get authenticated user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create or retrieve a Stripe customer
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: session.user.email,
      metadata: { supabase_user_id: session.user.id },
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Store customer in Supabase
    const { error } = await supabase.from("customers").insert({
      user_id: session.user.id,
      stripe_customer_id: customer.id,
      email: customer.email,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase error storing customer:", error);
      return NextResponse.json({ error: "Failed to store customer" }, { status: 500 });
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    if (paymentIntent && paymentIntent.status === "requires_action") {
      return NextResponse.json({
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
      });
    }

    return NextResponse.json({ success: true, subscriptionId: subscription.id });
  } catch (error: any) {
    console.error("Subscription error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
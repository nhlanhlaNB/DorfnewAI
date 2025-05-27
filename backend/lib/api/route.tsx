import { NextResponse } from "next/server";
import Stripe from "stripe";
import { buffer } from "micro";
import { createClient } from "@supabase/supabase-js";

// Initialize Stripe with Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil",
});

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function isEventProcessed(eventId: string) {
  const { data, error } = await supabase
    .from("processed_events")
    .select("event_id")
    .eq("event_id", eventId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Supabase error checking event:", error);
    throw error;
  }

  return !!data;
}

async function storeEventId(eventId: string) {
  const { error } = await supabase
    .from("processed_events")
    .insert({ event_id: eventId, processed_at: new Date().toISOString() });

  if (error) {
    console.error("Supabase error storing event ID:", error);
    throw error;
  }
}

async function storeSubscription(subscription: any) {
  // Retrieve customer to get user ID
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userId = (customer as Stripe.Customer).metadata.supabase_user_id || "unknown";

  const { error } = await supabase.from("subscriptions").insert({
    user_id: userId,
    subscription_id: subscription.id,
    plan: subscription.items.data[0].price.id,
    status: subscription.status,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Supabase error storing subscription:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature") || "";
  const body = await buffer(request);

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    // Prevent duplicate processing
    if (await isEventProcessed(event.id)) {
      console.log(`Event ${event.id} already processed`);
      return NextResponse.json({ received: true });
    }

    // Handle specific events for Individual, Business, Family plans
    switch (event.type) {
      case "invoice.payment_succeeded":
        console.log("Payment succeeded for invoice:", event.data.object);
        // TODO: Update user subscription status in Supabase
        break;
      case "invoice.payment_failed":
        console.log("Payment failed for invoice:", event.data.object);
        // TODO: Notify user to update payment method (e.g., via SendGrid)
        break;
      case "customer.subscription.created":
        console.log("Subscription created:", event.data.object);
        await storeSubscription(event.data.object);
        break;
      case "customer.subscription.updated":
        console.log("Subscription updated:", event.data.object);
        // TODO: Update subscription details in Supabase
        break;
      case "customer.subscription.deleted":
        console.log("Subscription canceled:", event.data.object);
        // TODO: Update subscription status in Supabase
        break;
      case "charge.succeeded":
        console.log("Charge succeeded:", event.data.object);
        // TODO: Log successful charge in Supabase
        break;
      case "charge.failed":
        console.log("Charge failed:", event.data.object);
        // TODO: Notify user of failed charge
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Mark event as processed
    await storeEventId(event.id);

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
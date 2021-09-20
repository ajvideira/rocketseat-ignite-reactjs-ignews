import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import { saveSubscription } from "../../lib/manageSubstription";
import { stripe } from "../../services/stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function webhooks(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .setHeader("Allow", ["POST"])
      .status(405)
      .end("Method Not Allowed");
  }

  const bufferedRequest = await buffer(req);

  const stripeSignature = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      bufferedRequest.toString(),
      stripeSignature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object as Stripe.Subscription;
        await saveSubscription(
          subscription.id,
          subscription.customer.toString()
        );
        break;
      case "checkout.session.completed":
        const sessionCheckout = event.data.object as Stripe.Checkout.Session;
        await saveSubscription(
          sessionCheckout.subscription.toString(),
          sessionCheckout.customer.toString()
        );
        break;
    }
    return res.json({ received: true });
  } catch (error) {
    return res.status(400).end(`Webhook error: ${error.message}`);
  }
}

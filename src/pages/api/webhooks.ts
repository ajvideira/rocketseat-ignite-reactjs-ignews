import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import { stripe } from "../../services/stripe";

const relevantEvents = new Set(["checkout.session.completed"]);

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

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      bufferedRequest.toString(),
      stripeSignature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log(error);
    return res.status(400).end(`Webhook error: ${error.message}`);
  }

  if (relevantEvents.has(event.type)) {
    console.log("Evento recebido", event);
  }

  return res.json({ received: true });
}

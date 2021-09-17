import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { query as q } from "faunadb";

import { fauna } from "../../services/faunadb";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    email: string;
    stripe_customer_id: string;
  };
};

export default async function subscribe(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const session = await getSession({ req: request });

  if (!session?.user) {
    return response.status(401).json({
      message: "You must be logged in to subscribe",
    });
  }

  if (request.method !== "POST") {
    return response
      .setHeader("Allow", ["POST"])
      .status(405)
      .end("Method Not Allowed");
  }

  const user = await fauna.query<User>(
    q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
  );

  let stripeCustomerId = null;

  if (user.data.stripe_customer_id) {
    stripeCustomerId = user.data.stripe_customer_id;
  } else {
    const stripeCustomer = await stripe.customers.create({
      email: session.user.email,
    });
    stripeCustomerId = stripeCustomer.id;
  }

  await fauna.query(
    q.Update(q.Ref(q.Collection("users"), user.ref.id), {
      data: {
        stripe_customer_id: stripeCustomerId,
      },
    })
  );

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    success_url: `${process.env.NEXTAUTH_URL}/posts`,
    cancel_url: `${process.env.NEXTAUTH_URL}`,
    allow_promotion_codes: true,
    billing_address_collection: "required",
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: "price_1JYfbaKMMxmpALteEaycAnC8",
        quantity: 1,
      },
    ],
  });

  return response.status(200).json({
    sessionId: checkoutSession.id,
  });
}

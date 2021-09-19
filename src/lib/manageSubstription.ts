import { query as q } from "faunadb";

import { fauna } from "../services/faunadb";
import { stripe } from "../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string
) {
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId))
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    stripe_subscription_id: subscription.id,
    stripe_status: subscription.status,
    stripe_price_id: subscription.items.data[0].price.id,
    user_ref: userRef,
  };

  await fauna.query(
    q.If(
      q.Exists(
        q.Match(
          q.Index("subscription_by_stripe_subscription_id"),
          subscriptionId
        )
      ),
      q.Replace(
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index("subscription_by_stripe_subscription_id"),
              subscriptionId
            )
          )
        ),
        { data: subscriptionData }
      ),
      q.Create(q.Collection("subscriptions"), { data: subscriptionData })
    )
  );
}

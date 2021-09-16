import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { stripe } from '../../services/stripe';

export const subscribe = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  const { user } = await getSession();

  if (!user) {
    return response.status(401).json({
      message: 'You must be logged in to subscribe',
    });
  }

  if (request.method !== 'POST') {
    return response
      .setHeader('Allow', ['POST'])
      .status(405)
      .end('Method Not Allowed');
  }

  const stripeCustomer = await stripe.customers.create({
    email: user.email,
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomer.id,
    success_url: `${process.env.NEXTAUTH_URL}/posts`,
    cancel_url: `${process.env.NEXTAUTH_URL}`,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: 'price_1JYfbaKMMxmpALteEaycAnC8',
        quantity: 1,
      },
    ],
  });

  return response.status(200).json({
    sessionId: checkoutSession.id,
  });
};

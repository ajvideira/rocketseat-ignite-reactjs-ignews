import { loadStripe } from "@stripe/stripe-js";

export async function getStrypeJs() {
  return await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
}

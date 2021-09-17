import { signIn, useSession } from "next-auth/client";
import { api } from "../../services/api";
import { getStrypeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

type SubscribeButtonProps = {
  priceId: string;
};

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }
    try {
      const {
        data: { sessionId },
      } = await api.post("/subscribe");

      const stripeJs = await getStrypeJs();
      await stripeJs.redirectToCheckout({
        sessionId,
      });
    } catch (error) {
      alert(error.message);
    }
  }
  return (
    <button className={styles.container} onClick={handleSubscribe}>
      Subscribe now
    </button>
  );
}

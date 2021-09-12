import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

type HomeProps = {
  product: {
    priceId: string;
    amount: string;
  };
};

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Início - ig.news</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about
            <br />
            the <span>React</span> world
          </h1>
          <p>
            Get access to all publications
            <br />
            <span>for {product.amount}/month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </article>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const price = await stripe.prices.retrieve('price_1JYfbaKMMxmpALteEaycAnC8');

  return {
    props: {
      product: {
        priceId: price.id,
        amount: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(price.unit_amount / 100),
      },
    },
    revalidate: 60 * 60 * 24, //24h
  };
};

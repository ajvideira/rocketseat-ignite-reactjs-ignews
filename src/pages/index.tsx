import Head from 'next/head';

import styles from './home.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>Início - ig.news</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.hero}>
          <p>👏 Hey, welcome</p>
          <h1>
            News about
            <br />
            the <span>React</span> world
          </h1>
          <p>
            Get access to all publications
            <br />
            <span>for $9.90/month</span>
          </p>
        </article>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

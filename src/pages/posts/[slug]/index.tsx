import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { RichText } from "prismic-dom";

import { Post } from "../../../models";
import { getPrismicClient } from "../../../services/prismic";

import styles from "./styles.module.scss";

type PostPageProps = {
  post: Post;
};

export default function PostPage({ post }: PostPageProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>
      <main className={styles.container}>
        <article>
          <h1>{post.title}</h1>
          <time>{post.createdAt}</time>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PostPageProps> = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });

  console.log(session);

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { slug } = params;

  const response = await getPrismicClient(req).getByUID(
    "post",
    String(slug),
    {}
  );

  if (!response) {
    null;
  }

  return {
    props: {
      post: {
        slug: response.uid,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        createdAt: new Date(response.first_publication_date).toLocaleString(
          "pt-BR",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        ),
      },
    },
  };
};

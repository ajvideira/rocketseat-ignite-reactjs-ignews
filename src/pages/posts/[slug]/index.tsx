import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { useEffect } from "react";

import { Post } from "../../../models";
import { getPrismicClient } from "../../../services/prismic";

import styles from "./styles.module.scss";

type PostPageProps = {
  post: Post;
};

export default function PostPage({ post }: PostPageProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.activeSubscription) {
      router.push(`/posts/preview/${post.slug}`);
      return;
    }
  }, [session, post, router]);

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
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
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

import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { RichText } from "prismic-dom";

import { Post } from "../../../../models";
import { getPrismicClient } from "../../../../services/prismic";

import styles from "./styles.module.scss";
import { useEffect } from "react";

type PostPreviewPageProps = {
  post: Post;
};

export default function PostPreviewPage({ post }: PostPreviewPageProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
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
            className={`${styles.content} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?&nbsp;
            <Link href="/">
              <a title="Subscribe now">Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<PostPreviewPageProps> = async ({
  params,
}) => {
  const { slug } = params;

  const response = await getPrismicClient().getByUID("post", String(slug), {});

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
        content: RichText.asHtml(response.data.content.splice(0, 3)),
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

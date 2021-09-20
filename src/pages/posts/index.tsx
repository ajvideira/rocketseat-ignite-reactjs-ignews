import { GetStaticProps } from "next";
import Head from "next/head";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

import { getPrismicClient } from "../../services/prismic";

import styles from "./styles.module.scss";
import { Post } from "../../models";

type PostsProps = {
  posts: Post[];
};

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignite</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.content}>
          {posts.map((post) => (
            <a href="#" key={post.slug}>
              <time>{post.createdAt}</time>
              <strong>{post.title}</strong>
              <p>{post.summary}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<PostsProps> = async () => {
  const prismicClient = getPrismicClient();

  const response = await prismicClient.query(
    [Prismic.predicates.at("document.type", "post")],
    {
      fetch: ["post.title", "post.content"],
      pageSize: 100,
    }
  );

  const posts = response.results.map((post) => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    summary:
      post.data.content.find((element: any) => element.type === "paragraph")
        ?.text ?? "",
    createdAt: new Date(post.first_publication_date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  }));

  return {
    props: {
      posts,
    },
  };
};

import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { Post } from "../../models";
import PostPreviewPage, {
  getStaticProps,
} from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("next-auth/client");
jest.mock("next/router");
jest.mock("../../services/prismic");

const post: Post = {
  slug: "my-fake-post",
  title: "My fake post",
  content: "<p>My fake content</p>",
  createdAt: "18 de março de 2022",
};

describe("PostPreview page", () => {
  it("should render correctly", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<PostPreviewPage post={post} />);

    expect(screen.getByText("My fake post")).toBeInTheDocument();
    expect(screen.getByText("My fake content")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("should redirect to full post when user has a active subscription", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        activeSubscription: "fake-subscription",
      },
      false,
    ]);

    const pushMocked = jest.fn();
    const useRouterMocked = jest.mocked(useRouter);
    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    render(<PostPreviewPage post={post} />);

    expect(pushMocked).toHaveBeenCalledWith(`/posts/${post.slug}`);
  });

  it("should redirect to home if not find the post", async () => {
    const prismicMocked = jest.mocked(getPrismicClient);
    prismicMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce(null),
    } as any);

    const response = await getStaticProps({
      params: { slug: "my-fake-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        }),
      })
    );
  });

  it("should load the post", async () => {
    const prismicMocked = jest.mocked(getPrismicClient);
    prismicMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        uid: "my-fake-post",
        first_publication_date: "03-18-2022",
        data: {
          title: [{ type: "heading", text: "My fake post" }],
          content: [{ type: "paragraph", text: "My fake content" }],
        },
      }),
    } as any);

    const response = await getStaticProps({
      params: { slug: "my-fake-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          post: expect.objectContaining({
            slug: "my-fake-post",
            title: "My fake post",
            content: "<p>My fake content</p>",
            createdAt: "18 de março de 2022",
          }),
        }),
      })
    );
  });
});

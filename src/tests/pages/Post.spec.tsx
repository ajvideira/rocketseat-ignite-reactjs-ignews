import { render, screen } from "@testing-library/react";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import PostPage, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("next-auth/client");
jest.mock("next/router");
jest.mock("../../services/prismic");

describe("Post page", () => {
  it("should render correctly if user has a active subscription", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        activeSubscription: "fake-subscription",
      },
      false,
    ]);

    render(
      <PostPage
        post={{
          slug: "my-fake-post",
          title: "My fake post",
          content: "<p>My fake content</p>",
          createdAt: "18 de março de 2022",
        }}
      />
    );

    expect(screen.getByText("My fake post")).toBeInTheDocument();
    expect(screen.getByText("My fake content")).toBeInTheDocument();
  });

  it("should redirect to preview if user has not a active subscription", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([{}, false]);

    const pushMocked = jest.fn();
    const useRouterMocked = jest.mocked(useRouter);
    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    render(
      <PostPage
        post={{
          slug: "my-fake-post",
          title: "My fake post",
          content: "<p>My fake content</p>",
          createdAt: "18 de março de 2022",
        }}
      />
    );

    expect(pushMocked).toHaveBeenCalledWith("/posts/preview/my-fake-post");
  });

  it("should redirect to home if user has no active subscription", async () => {
    const getSessionMocked = jest.mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({});

    const response = await getServerSideProps({
      req: {
        cookies: {},
      },
      params: { slug: "my-fake-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
          permanent: false,
        }),
      })
    );
  });

  it("should redirect to home if not find the post", async () => {
    const getSessionMocked = jest.mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-subscription",
    });

    const prismicMocked = jest.mocked(getPrismicClient);
    prismicMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce(null),
    } as any);

    const response = await getServerSideProps({
      req: { cookies: {} },
      params: { slug: "my-fake-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
          permanent: false,
        }),
      })
    );
  });

  it("should load data correctly", async () => {
    const getSessionMocked = jest.mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-subscription",
    });

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

    const response = await getServerSideProps({
      req: { cookies: {} },
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

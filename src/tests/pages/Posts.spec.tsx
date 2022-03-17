import { render, screen } from "@testing-library/react";
import { Post } from "../../models";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

jest.mock("../../services/prismic");

const posts: Post[] = [
  {
    slug: "my-fake-post",
    title: "My fake post",
    content: "My fake content",
    summary: "My fake summary",
    createdAt: "17 de março de 2022",
  },
];

describe("Posts page", () => {
  it("should render correctly", () => {
    render(<Posts posts={posts} />);
    expect(screen.getByText("My fake post")).toBeInTheDocument();
  });

  it("should load initial data", async () => {
    const prismicMocked = jest.mocked(getPrismicClient);
    prismicMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "my-fake-post",
            first_publication_date: "03-17-2022",
            data: {
              title: [{ type: "heading", text: "My fake post" }],
              content: [{ type: "paragraph", text: "My fake content" }],
            },
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "my-fake-post",
              title: "My fake post",
              summary: "My fake content",
              createdAt: "17 de março de 2022",
            },
          ],
        },
      })
    );
  });
});

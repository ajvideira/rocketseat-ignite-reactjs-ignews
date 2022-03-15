import { render } from "@testing-library/react";
import { ActiveLink } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return { asPath: "/" };
    },
  };
});

describe("ActiveLink Component", () => {
  it("should renders correctly", () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(getByText("Home")).toBeInTheDocument();
  });

  it("should adds active class when href is path", () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(getByText("Home")).toHaveClass("active");
  });

  it("should not adds active class when href is not path", () => {
    const { getByText } = render(
      <ActiveLink href="/posts" activeClassName="active">
        <a>Posts</a>
      </ActiveLink>
    );

    expect(getByText("Posts")).not.toHaveClass("active");
  });
});

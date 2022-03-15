import { render, screen } from "@testing-library/react";
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
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("should adds active class when href is path", () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText("Home")).toHaveClass("active");
  });

  it("should not adds active class when href is not path", () => {
    render(
      <ActiveLink href="/posts" activeClassName="active">
        <a>Posts</a>
      </ActiveLink>
    );

    expect(screen.getByText("Posts")).not.toHaveClass("active");
  });
});

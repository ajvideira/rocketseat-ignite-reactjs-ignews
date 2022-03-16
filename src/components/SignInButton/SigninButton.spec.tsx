import { render, screen } from "@testing-library/react";
import { SignInButton } from ".";
import { useSession } from "next-auth/client";

jest.mock("next-auth/client");

describe("SigninButton Component", () => {
  it("should renders correctly when not authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SignInButton />);

    expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument();
  });

  it("should renders correctly when authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: "John Doe",
          email: "john.doe@example.com",
          image: "https://google.com",
        },
        expires: "fake-expires",
      },
      false,
    ]);

    render(<SignInButton />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});

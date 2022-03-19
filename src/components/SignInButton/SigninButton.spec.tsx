import { fireEvent, render, screen } from "@testing-library/react";
import { SignInButton } from ".";
import { signIn, signOut, useSession } from "next-auth/client";

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

  it("should call signIn when user click on the button and is not authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    const signInMocked = jest.mocked(signIn);

    render(<SignInButton />);

    const button = screen.getByText("Sign in with GitHub");
    fireEvent.click(button);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("should call signOut when user click on the button and is authenticated", () => {
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

    const signOutMocked = jest.mocked(signOut);

    render(<SignInButton />);

    const button = screen.getByText("John Doe");
    fireEvent.click(button);

    expect(signOutMocked).toHaveBeenCalled();
  });
});

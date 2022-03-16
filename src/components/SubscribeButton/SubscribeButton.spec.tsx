import { render, screen, fireEvent } from "@testing-library/react";
import { SubscribeButton } from ".";
import { useSession, signIn } from "next-auth/client";
import { useRouter } from "next/router";

jest.mock("next-auth/client");
jest.mock("next/router");

describe("SubscribeButton Component", () => {
  it("should renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("should redirects to sign in when not authenticated ", () => {
    const signInMocked = jest.mocked(signIn);
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    const button = screen.getByText("Subscribe now");

    fireEvent.click(button);

    expect(signInMocked).toHaveBeenCalledWith("github");
  });

  it("should redirects to posts when user already has a subscription", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: "John Doe",
          email: "john.doe@example.com",
          image: "https://google.com",
        },
        activeSubscription: "fake-subscription",
        expires: "fake-expires",
      },
      false,
    ]);

    const pushMocked = jest.fn();
    const useRouterMocked = jest.mocked(useRouter);
    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    render(<SubscribeButton />);

    const button = screen.getByText("Subscribe now");

    fireEvent.click(button);

    expect(pushMocked).toHaveBeenCalledWith("/posts");
  });
});

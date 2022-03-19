import { render, screen, fireEvent } from "@testing-library/react";
import { SubscribeButton } from ".";
import { useSession, signIn } from "next-auth/client";
import { useRouter } from "next/router";
import AxiosMock from "axios-mock-adapter";
import { api } from "../../services/api";
import { getStrypeJs } from "../../services/stripe-js";

jest.mock("next-auth/client");
jest.mock("next/router");
jest.mock("../../services/stripe-js");

const apiMock = new AxiosMock(api);

describe("SubscribeButton Component", () => {
  beforeEach(() => {
    apiMock.reset();
  });
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

  /*it("should redirect to stripe website when click to subscribe and not have yet a subscription", async () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: "John Doe",
          email: "john.doe@example.com",
          image: "https://google.com",
        },
        activeSubscription: null,
        expires: "fake-expires",
      },
      false,
    ]);

    apiMock.onPost("/subscribe").reply(200, {
      data: {
        sessionId: "fake-session-id",
      },
    });

    const redirectToCheckoutMocked = jest.fn();

    const stripeMocked = jest.mocked(getStrypeJs);
    stripeMocked.mockReturnValueOnce({
      redirectToCheckout: redirectToCheckoutMocked,
    } as any);

    render(<SubscribeButton />);

    const button = screen.getByText("Subscribe now");
    fireEvent.click(button);

    expect(redirectToCheckoutMocked).toHaveBeenCalled();
  });*/
});

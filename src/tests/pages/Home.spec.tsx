import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";

jest.mock("next-auth/client", () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});
jest.mock("next/router");
jest.mock("../../services/stripe");

describe("Home page", () => {
  it("should render correctly", () => {
    render(<Home product={{ priceId: "face-price-id", amount: "R$10,00" }} />);
    expect(screen.getByText(/R\$10,00/i)).toBeInTheDocument();
  });

  it("should load initial data", async () => {
    const stripePricesRetrieveMocked = jest.mocked(stripe.prices.retrieve);
    stripePricesRetrieveMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-price-id",
            amount: "$10.00",
          },
        },
      })
    );
  });
});

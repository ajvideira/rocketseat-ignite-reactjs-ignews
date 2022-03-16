import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";
import Home from "../../pages";

jest.mock("next-auth/client", () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});
jest.mock("next/router");

describe("Home page", () => {
  it("should render correctly", () => {
    render(<Home product={{ priceId: "face-price-id", amount: "R$10,00" }} />);
    expect(screen.getByText(/R\$10,00/i)).toBeInTheDocument();
  });
});

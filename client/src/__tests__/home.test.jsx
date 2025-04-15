import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect'; // for the toBeInTheDocument matcher
import Home from "../pages/Home";

describe("Home Page", () => {
  test("should render the home page with the text 'home'", () => {
    render(<Home />);
    const linkElement = screen.getByText(/home/i);
    expect(linkElement).toBeInTheDocument();
  });
});
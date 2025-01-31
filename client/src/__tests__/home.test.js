// test for the home page
import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../pages/Home";

test("renders home page", () => {
  render(<Home />);
  const linkElement = screen.getByText(/home/i);
  expect(linkElement).toBeInTheDocument();
});



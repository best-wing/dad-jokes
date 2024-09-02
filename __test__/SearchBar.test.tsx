import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBar from "@/app/components/SearchBar";

describe("SearchBar component", () => {
  it("should collapse the dropdown when clicking outside of the input or dropdown", async () => {
    const onSelectMock = jest.fn();
    render(<SearchBar onSelect={onSelectMock} />);

    const input = screen.getByTestId("searchInput-test");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "dad" } });

    const dropdown = screen.getByTestId("dropdownList-test");

    fireEvent.mouseDown(document);

    await waitFor(() => {
      expect(dropdown).toHaveClass("hidden");
    });
  });

  it("should collapse the dropdown when Escape key is pressed", async () => {
    const onSelectMock = jest.fn();
    render(<SearchBar onSelect={onSelectMock} />);

    const input = screen.getByTestId("searchInput-test");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "dad" } });

    const dropdown = screen.getByTestId("dropdownList-test");

    await waitFor(() => {
      expect(dropdown).toHaveClass("hidden");
    });
  });
});

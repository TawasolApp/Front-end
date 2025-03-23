import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import CompanyHeader from "../pages/CompanyPage/Components/CompanyHeader.jsx";
import axios from "axios";

// Mock axios
vi.mock("axios");

// Mock Data
const mockCompany = {
  name: "Test Company",
  description: "We build software.",
  address: "123 Main Street",
  followers: 2000,
  employees: 500,
  banner: "https://example.com/banner.jpg",
  logo: "https://example.com/logo.jpg",
  website: "https://testcompany.com",
};

// Helper function to render with Router (because `CompanyHeader` uses `useNavigate`)
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("CompanyHeader Component", () => {
  it("renders loading state first", () => {
    renderWithRouter(<CompanyHeader companyId="test-company" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders company details after API call", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCompany });

    renderWithRouter(<CompanyHeader companyId="test-company" />);

    await waitFor(() =>
      expect(screen.getByText("Test Company")).toBeInTheDocument()
    );

    expect(screen.getByText("We build software.")).toBeInTheDocument();
    expect(
      screen.getByText("123 Main Street · 2K followers · 500+ employees")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /visit website/i })
    ).toHaveAttribute("href", mockCompany.website);
  });

  it("handles API error gracefully", async () => {
    axios.get.mockRejectedValueOnce(new Error("API error"));

    renderWithRouter(<CompanyHeader companyId="test-company" />);

    await waitFor(() =>
      expect(screen.queryByText("Test Company")).not.toBeInTheDocument()
    );
  });

  it("handles follow button click", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCompany });

    renderWithRouter(<CompanyHeader companyId="test-company" />);

    await waitFor(() => screen.getByText("+ Follow"));

    const followButton = screen.getByText("+ Follow");
    fireEvent.click(followButton);

    expect(screen.getByText("✓ Following")).toBeInTheDocument();
  });

  it("shows unfollow modal when clicking following button", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCompany });

    renderWithRouter(<CompanyHeader companyId="test-company" />);

    await waitFor(() => screen.getByText("+ Follow"));

    fireEvent.click(screen.getByText("+ Follow"));
    fireEvent.click(screen.getByText("✓ Following"));

    await waitFor(() =>
      expect(screen.getByText("Unfollow Page")).toBeInTheDocument()
    );
  });

  it("navigates correctly when clicking navigation buttons", async () => {
    axios.get.mockResolvedValueOnce({ data: mockCompany });

    renderWithRouter(<CompanyHeader companyId="test-company" />);

    await waitFor(() => screen.getByText("Test Company"));

    const aboutButton = screen.getByText("About");
    fireEvent.click(aboutButton);

    expect(window.location.pathname).toContain("/company/test-company/about");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CertificationsSection from "../pages/UserProfile/Components/Sections/CertificationsSection";

// Mock GenericSection component to avoid deep rendering issues
vi.mock(
  "../pages/UserProfile/Components/GenericDisplay/GenericSection",
  () => ({
    default: ({ title, type, items }) => (
      <div>
        <h2>{title}</h2>
        <div data-testid="type">{type}</div>
        <ul>
          {items.map((item, index) => (
            <li key={index} data-testid="cert-item">
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    ),
  }),
);

describe("CertificationsSection Component", () => {
  const mockUser = {
    certifications: [
      { name: "AWS Certified Developer", issuer: "Amazon" },
      { name: "Azure Fundamentals", issuer: "Microsoft" },
    ],
  };

  it("renders title and certification items", () => {
    render(<CertificationsSection isOwner={true} user={mockUser} />);

    expect(screen.getByText("Licenses & Certifications")).toBeInTheDocument();
    expect(screen.getByTestId("type").textContent).toBe("certifications");
    expect(screen.getAllByTestId("cert-item")).toHaveLength(2);
    expect(screen.getByText("AWS Certified Developer")).toBeInTheDocument();
    expect(screen.getByText("Azure Fundamentals")).toBeInTheDocument();
  });

  it("renders an empty section if no certifications provided", () => {
    render(
      <CertificationsSection isOwner={false} user={{ certifications: [] }} />,
    );
    expect(screen.queryByTestId("cert-item")).not.toBeInTheDocument();
  });

  it("handles missing certifications field gracefully", () => {
    render(<CertificationsSection isOwner={false} user={{}} />);
    expect(screen.queryByTestId("cert-item")).not.toBeInTheDocument();
  });
});

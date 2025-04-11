import { render, screen, fireEvent } from "@testing-library/react";
import JobCard from "../../pages/Company/Components/JobsPage/JobCard";

describe("JobCard", () => {
  const job = {
    position: "Frontend Developer",
    location: "Cairo, Egypt",
  };

  const companyName = "Test Company";
  const logoUrl = "/logo.png";

  test("renders job details correctly", () => {
    render(
      <JobCard
        job={job}
        name={companyName}
        logo={logoUrl}
        isSelected={false}
      />,
    );

    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText(companyName.toUpperCase())).toBeInTheDocument();
    expect(screen.getByText("Cairo, Egypt")).toBeInTheDocument();

    const logo = screen.getByRole("img");
    expect(logo).toHaveAttribute("src", logoUrl);
    expect(logo).toHaveAttribute("alt", companyName);
  });

  test("does not render logo if logo prop is missing", () => {
    render(<JobCard job={job} name={companyName} isSelected={false} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(
      <JobCard
        job={job}
        name={companyName}
        logo={logoUrl}
        isSelected={false}
        onClick={handleClick}
      />,
    );

    const card = screen.getByText("Frontend Developer").closest("div");
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalled();
  });

  test("applies selected style when isSelected is true", () => {
    const { container } = render(
      <JobCard job={job} name={companyName} isSelected={true} />,
    );

    const rootDiv = container.firstChild;
    expect(rootDiv).toHaveClass("bg-selectedjob");
  });

  test("applies hover style when isSelected is false", () => {
    const { container } = render(
      <JobCard job={job} name={companyName} isSelected={false} />,
    );

    const rootDiv = container.firstChild;
    expect(rootDiv).toHaveClass("hover:bg-cardBackgroundHover");
  });
});

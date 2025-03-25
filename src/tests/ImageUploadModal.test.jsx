import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageUploadModal from "../../src/pages/UserProfile/Components/ImageUploadModal";

// Mock URL.createObjectURL globally
beforeAll(() => {
  global.URL.createObjectURL = vi.fn(() => "mocked-url");
});

afterAll(() => {
  global.URL.createObjectURL = undefined;
});

describe("ImageUploadModal Component", () => {
  const mockOnClose = vi.fn();
  const mockOnUpload = vi.fn();

  beforeEach(() => {
    document.body.classList.remove("overflow-hidden");
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.classList.remove("overflow-hidden");
  });

  it("does not render if isOpen is false", () => {
    const { container } = render(
      <ImageUploadModal
        isOpen={false}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
      />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders modal content when open", () => {
    render(
      <ImageUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
      />
    );

    expect(screen.getByText("Upload Image")).toBeInTheDocument();
    expect(screen.getByText("Choose file")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onClose when cancel is clicked", () => {
    render(
      <ImageUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
      />
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows preview and save button after image selection", () => {
    render(
      <ImageUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
      />
    );

    const file = new File(["dummy-content"], "test.png", { type: "image/png" });
    const fileInput = screen
      .getByLabelText(/choose file/i)
      .parentElement.querySelector("input");

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByAltText("Preview")).toBeInTheDocument();
  });

  it("calls onUpload and onClose when Save is clicked", async () => {
    render(
      <ImageUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
      />
    );

    const file = new File(["image-data"], "avatar.jpg", { type: "image/jpeg" });
    const fileInput = screen
      .getByLabelText(/choose file/i)
      .parentElement.querySelector("input");

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    const saveButton = await screen.findByRole("button", { name: /save/i });
    await fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledTimes(1);
      expect(mockOnUpload).toHaveBeenCalledWith("mocked-url");
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});

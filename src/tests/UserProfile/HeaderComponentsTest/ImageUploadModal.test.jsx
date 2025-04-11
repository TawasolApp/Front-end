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
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import ImageUploadModal from "../../../pages/UserProfile/Components/HeaderComponents/ImageUploadModal";

// Mock URL.createObjectURL globally (not needed anymore as you use FileReader)
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
    cleanup();
    document.body.classList.remove("overflow-hidden");
  });

  it("does not render if isOpen is false", () => {
    const { container } = render(
      <ImageUploadModal
        isOpen={false}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
      />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders modal content when open", () => {
    render(
      <ImageUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
        uploadType="profile"
      />,
    );

    expect(screen.getByText("Upload Profile Image")).toBeInTheDocument();
    expect(screen.getByText("Choose file")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(
      <ImageUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
        uploadType="profile"
      />,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows preview and Save button after image selection", async () => {
    render(
      <ImageUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
        uploadType="profile"
      />,
    );

    const file = new File(["dummy"], "test.png", { type: "image/png" });
    const fileInput = screen.getByTestId("file-input");

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(await screen.findByAltText("Preview")).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /save/i }),
    ).toBeInTheDocument();
  });

  it("calls onUpload with file and onClose when Save is clicked", async () => {
    render(
      <ImageUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
        uploadType="profile"
      />,
    );

    const file = new File(["avatar"], "avatar.jpg", { type: "image/jpeg" });
    const fileInput = screen.getByTestId("file-input");

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    const saveButton = await screen.findByRole("button", { name: /save/i });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(file);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});

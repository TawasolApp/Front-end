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
  it("adds overflow-hidden to body on open and removes on close", () => {
    const { rerender, unmount } = render(
      <ImageUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
      />,
    );
    expect(document.body.classList.contains("overflow-hidden")).toBe(true);

    rerender(
      <ImageUploadModal
        isOpen={false}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
      />,
    );
    expect(document.body.classList.contains("overflow-hidden")).toBe(false);

    unmount();
    expect(document.body.classList.contains("overflow-hidden")).toBe(false);
  });
  it("shows Delete button and triggers confirmation modal", async () => {
    render(
      <ImageUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
        currentImage="non-default.jpg"
        defaultImage="default.jpg"
      />,
    );

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);
    expect(await screen.findByText(/confirm delete/i)).toBeInTheDocument();
  });
  it("confirms deletion and calls onUpload(null)", async () => {
    const mockOnClose = vi.fn();
    const mockOnUpload = vi.fn();

    render(
      <ImageUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
        currentImage="some-image.jpg"
        defaultImage="default.jpg"
      />,
    );

    // Click main delete button (opens confirmation modal)
    fireEvent.click(screen.getByText("Delete"));

    // Click the delete button in the confirm modal specifically
    const confirmDeleteBtn = await screen.findByTestId("confirm-modal");
    fireEvent.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(null);
      expect(mockOnClose).toHaveBeenCalled();
    });
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
  it("cancels the delete confirmation modal", async () => {
    render(
      <ImageUploadModal
        isOpen={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
        currentImage="non-default.jpg"
        defaultImage="default.jpg"
      />,
    );

    // Step 1: Open confirmation modal
    fireEvent.click(screen.getByText("Delete"));

    // Step 2: Wait for both "Cancel" buttons (main + confirm modal)
    const cancelButtons = await screen.findAllByRole("button", {
      name: /^cancel$/i,
    });

    // Step 3: Click the last "Cancel" button (usually the one in the confirm modal)
    fireEvent.click(cancelButtons[cancelButtons.length - 1]);

    // Step 4: Confirm the modal disappears
    await waitFor(() => {
      expect(
        screen.queryByText(/are you sure you want to delete this image/i),
      ).not.toBeInTheDocument();
    });
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

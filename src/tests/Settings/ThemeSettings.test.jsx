import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ThemeSettings from "../../pages/Settings/ThemeSettings";
import * as reactRedux from "react-redux";
import * as reactRouterDom from "react-router-dom";
import { setTheme } from "../../store/themeSlice";

// Mock Redux hooks
vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: vi.fn()
  };
});

// Mock Router hooks
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn()
}));

// Mock MUI icons
vi.mock("@mui/icons-material", () => ({
  ArrowForwardOutlined: () => <div data-testid="arrow-icon" />
}));

// Mock theme slice
vi.mock("../../store/themeSlice", () => ({
  setTheme: vi.fn((theme) => ({ type: "theme/setTheme", payload: theme }))
}));

describe("ThemeSettings Component", () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    reactRedux.useDispatch.mockReturnValue(mockDispatch);
    reactRouterDom.useNavigate.mockReturnValue(mockNavigate);
  });
  
  test("renders theme preferences section correctly", () => {
    reactRedux.useSelector.mockImplementation((selector) => {
      return selector({
        theme: { theme: "light" },
        authentication: { email: null, isSocialLogin: false }
      });
    });
    
    render(<ThemeSettings />);
    
    expect(screen.getByText("Theme Preferences")).toBeInTheDocument();
    expect(screen.getByText("Light Mode")).toBeInTheDocument();
    expect(screen.getByText("Dark Mode")).toBeInTheDocument();
  });
  
  test("selects light theme correctly", () => {
    reactRedux.useSelector.mockImplementation((selector) => {
      return selector({
        theme: { theme: "light" },
        authentication: { email: null, isSocialLogin: false }
      });
    });
    
    render(<ThemeSettings />);
    
    const lightRadio = screen.getByLabelText(/Light Mode/);
    const darkRadio = screen.getByLabelText(/Dark Mode/);
    
    expect(lightRadio.checked).toBe(true);
    expect(darkRadio.checked).toBe(false);
  });
  
  test("selects dark theme correctly", () => {
    reactRedux.useSelector.mockImplementation((selector) => {
      return selector({
        theme: { theme: "dark" },
        authentication: { email: null, isSocialLogin: false }
      });
    });
    
    render(<ThemeSettings />);
    
    const lightRadio = screen.getByLabelText(/Light Mode/);
    const darkRadio = screen.getByLabelText(/Dark Mode/);
    
    expect(lightRadio.checked).toBe(false);
    expect(darkRadio.checked).toBe(true);
  });
  
  test("changes theme when radio button is clicked", () => {
    reactRedux.useSelector.mockImplementation((selector) => {
      return selector({
        theme: { theme: "light" },
        authentication: { email: null, isSocialLogin: false }
      });
    });
    
    render(<ThemeSettings />);
    
    const darkRadio = screen.getByLabelText(/Dark Mode/);
    fireEvent.click(darkRadio);
    
    expect(mockDispatch).toHaveBeenCalledWith(setTheme("dark"));
  });
  
  test("shows email update option when email exists", () => {
    reactRedux.useSelector.mockImplementation((selector) => {
      return selector({
        theme: { theme: "light" },
        authentication: { email: "test@example.com", isSocialLogin: false }
      });
    });
    
    render(<ThemeSettings />);
    
    expect(screen.getByText("Update email address")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });
  
  test("hides email update option when email doesn't exist", () => {
    reactRedux.useSelector.mockImplementation((selector) => {
      return selector({
        theme: { theme: "light" },
        authentication: { email: null, isSocialLogin: false }
      });
    });
    
    render(<ThemeSettings />);
    
    expect(screen.queryByText("Update email address")).not.toBeInTheDocument();
  });
  
  test("shows password change option for non-social login users", () => {
    reactRedux.useSelector.mockImplementation((selector) => {
      return selector({
        theme: { theme: "light" },
        authentication: { email: "test@example.com", isSocialLogin: false }
      });
    });
    
    render(<ThemeSettings />);
    
    expect(screen.getByText("Change password")).toBeInTheDocument();
  });
  
  test("hides password change option for social login users", () => {
    reactRedux.useSelector.mockImplementation((selector) => {
      return selector({
        theme: { theme: "light" },
        authentication: { email: "test@example.com", isSocialLogin: true }
      });
    });
    
    render(<ThemeSettings />);
    
    expect(screen.queryByText("Change password")).not.toBeInTheDocument();
  });
  
  test("always displays delete account option", () => {
    reactRedux.useSelector.mockImplementation((selector) => {
      return selector({
        theme: { theme: "light" },
        authentication: { email: null, isSocialLogin: false }
      });
    });
    
    render(<ThemeSettings />);
    
    expect(screen.getByText("Delete your account")).toBeInTheDocument();
  });
  
  test("navigates to correct routes when options are clicked", () => {
    reactRedux.useSelector.mockImplementation((selector) => {
      return selector({
        theme: { theme: "light" },
        authentication: { email: "test@example.com", isSocialLogin: false }
      });
    });
    
    render(<ThemeSettings />);
    
    // Test email update navigation
    fireEvent.click(screen.getByText("Update email address").closest("div"));
    expect(mockNavigate).toHaveBeenCalledWith("/auth/update-email");
    
    // Test password change navigation
    fireEvent.click(screen.getByText("Change password").closest("div"));
    expect(mockNavigate).toHaveBeenCalledWith("/auth/update-password");
    
    // Test delete account navigation
    fireEvent.click(screen.getByText("Delete your account").closest("div"));
    expect(mockNavigate).toHaveBeenCalledWith("/auth/delete-account");
  });
});
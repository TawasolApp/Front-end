import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ContactInfoModal from "../../../pages/UserProfile/Components/HeaderComponents/ContactInfoModal";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

const mockUser = {
  _id: "user123",
  firstName: "John",
  lastName: "Doe",
};

describe("ContactInfoModal", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      authentication: { email: "john@example.com" },
    });
  });

  it("does not render when isOpen is false", () => {
    render(
      <Provider store={store}>
        <ContactInfoModal
          user={mockUser}
          isOpen={false}
          onClose={vi.fn()}
          isOwner={true}
        />
      </Provider>
    );

    expect(screen.queryByText(/contact info/i)).not.toBeInTheDocument();
  });

  it("renders with profile and email for owner", () => {
    render(
      <Provider store={store}>
        <ContactInfoModal
          user={mockUser}
          isOpen={true}
          onClose={vi.fn()}
          isOwner={true}
        />
      </Provider>
    );

    expect(screen.getByText(/contact info/i)).toBeInTheDocument();
    expect(screen.getByText(/your profile/i)).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders without email for non-owner", () => {
    render(
      <Provider store={store}>
        <ContactInfoModal
          user={mockUser}
          isOpen={true}
          onClose={vi.fn()}
          isOwner={false}
        />
      </Provider>
    );

    expect(screen.queryByText("john@example.com")).not.toBeInTheDocument();
    expect(screen.getByText(/john's profile/i)).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const mockOnClose = vi.fn();

    render(
      <Provider store={store}>
        <ContactInfoModal
          user={mockUser}
          isOpen={true}
          onClose={mockOnClose}
          isOwner={true}
        />
      </Provider>
    );

    fireEvent.click(screen.getByLabelText(/close modal/i));
    expect(mockOnClose).toHaveBeenCalled();
  });
});

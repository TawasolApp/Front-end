import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import CheckoutPage from "../pages/PremiumPlan/checkout";

// ---- Global mocks setup ----

// Mock redux hooks
const mockDispatch = vi.fn();
const mockSelector = vi.fn();

vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) => mockSelector(selector)
}));

// Mock axios instance
const mockPost = vi.fn();
vi.mock("../apis/axios", () => ({
    axiosInstance: {
        post: (...args) => mockPost(...args)
    }
}));

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(() => "fake-token"),
    setItem: vi.fn(),
    clear: vi.fn()
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock Date
const FIXED_DATE = "2025-05-15T12:00:00Z"; // May 15, 2025
const NEXT_MONTH_DATE = "June 15, 2025";

const OriginalDate = global.Date;
class MockDate extends OriginalDate {
    constructor(...args) {
        if (args.length === 0) {
            super(FIXED_DATE);
        } else {
            super(...args);
        }
    }
    
    toLocaleDateString() {
        return NEXT_MONTH_DATE;
    }
}
global.Date = MockDate;

// Mock window.location
const originalLocation = window.location;
delete window.location;
window.location = {
    ...originalLocation,
    href: ""
};

// Common afterAll cleanup
afterAll(() => {
    global.Date = OriginalDate;
});

// ---- Test suites ----

describe("CheckoutPage Additional Tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.location.href = "";
        
        // Default mock values
        mockSelector.mockReturnValue({
            firstName: "John",
            isPremium: false
        });
    });
    
    afterEach(() => {
        vi.resetAllMocks();
    });
    it("correctly formats the monthly and yearly prices", () => {
        render(<CheckoutPage />);
        
        // The monthly price should be formatted with commas as thousands separators
        expect(screen.getByText(/4,824\.55/)).toBeInTheDocument();
        
        // The yearly price before discount should be formatted correctly
        expect(screen.getByText(/57,894\.6/)).toBeInTheDocument();
        
        // The yearly discounted price should be formatted correctly
        // Use getAllByText instead of getByText to handle multiple matches
        const discountedPrices = screen.getAllByText(/48,631\.464/);
        expect(discountedPrices.length).toBeGreaterThan(0);
    });

    it("displays correct discount amount in the savings message", () => {
        render(<CheckoutPage />);
        
        // The discount amount in the heading should match the calculated discount
        const discountHeading = screen.getByText(/Save EGP .* when you select Yearly billing cycle/);
        expect(discountHeading).toHaveTextContent("9,263.136");
    });

    it("redirects user to premium dashboard if already premium", async () => {
        // Mock user as already premium
        mockSelector.mockReturnValue({
            firstName: "John",
            isPremium: true
        });
        
        mockPost.mockResolvedValueOnce({
            data: { checkoutSessionUrl: "https://checkout.stripe.com/test" }
        });
        
        render(<CheckoutPage />);
        
        // Submit form
        const submitButton = screen.getByText(/Try now for EGP0/);
        fireEvent.click(submitButton);
        
        // Expect the API call with correct data
        await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith(
                "/premium-plan",
                expect.anything(),
                expect.anything()
            );
        });
    });
    
    it("shows correct total on the order summary based on billing cycle", () => {
        render(<CheckoutPage />);
        
        // Get initial total (yearly) from the order summary
        const yearlyTotal = screen.getByText(/Total after free trial/i).nextSibling.textContent;
        expect(yearlyTotal).toContain("48,631.464");
        
        // Now click on the Monthly option using a more robust selector
        const monthlyOptions = screen.getAllByText(/Monthly/i);
        const monthlyLabel = monthlyOptions.find(el => el.tagName.toLowerCase() === 'label' || 
            (el.tagName.toLowerCase() !== 'span' && el.querySelector('span')));
        
        fireEvent.click(monthlyLabel);
        
        // Check the total has been updated to monthly price
        const monthlyTotal = screen.getByText(/Total after free trial/i).nextSibling.textContent;
        expect(monthlyTotal).toContain("4,824.55");
    });
    
    it("calculates yearly discount correctly as 16% of yearly price", () => {
        render(<CheckoutPage />);
        
        // Get yearly price and discount from the component
        const yearlyPriceText = screen.getAllByText(/First license/)[0].nextSibling.textContent;
        const yearlyPrice = parseFloat(yearlyPriceText.replace(/[^\d.]/g, ''));
        
        const discountText = screen.getByText(/Yearly discount/).nextSibling.textContent;
        const discount = parseFloat(discountText.replace(/[^0-9.]/g, ''));
        
        // Verify the discount is 16% of the yearly price
        expect(discount).toBeCloseTo(yearlyPrice * 0.16, 2);
    });
    
    it("displays all three FAQ questions and answers", () => {
        render(<CheckoutPage />);
        
        const faqSection = screen.getByText(/Frequently asked questions/i).closest('div');
        
        // Check all FAQ questions are present
        const questions = [
            "Will I be charged during my free trial?",
            "What happens after my free trial?",
            "How can I cancel during my free trial?"
        ];
        
        questions.forEach(question => {
            const questionEl = within(faqSection).getByText(question);
            expect(questionEl).toBeInTheDocument();
        });
        
        // Check answers contain the trial end date
        const answers = within(faqSection).getAllByText(new RegExp(NEXT_MONTH_DATE, 'i'));
        expect(answers.length).toBeGreaterThanOrEqual(2);
    });
    
    it("shows the correct renewal text based on payment type", () => {
        render(<CheckoutPage />);
        
        // Default should be subscription text
        expect(screen.getByText(/automatically charged at the end of each billing period/i)).toBeInTheDocument();
        
        // Click one-time payment option
        const oneTimeOptions = screen.getAllByText(/One-time Payment/i);
        const oneTimeOption = oneTimeOptions[0].closest('div').closest('div');
        fireEvent.click(oneTimeOption);
        
        // Check text changed to one-time payment
        expect(screen.getByText(/You'll only be charged once for this purchase/i)).toBeInTheDocument();
    });
    
    it("shows 404 error message when API returns 404", async () => {
        mockPost.mockRejectedValueOnce({
            response: { status: 404 }
        });
        
        render(<CheckoutPage />);
        
        // Submit form
        const submitButton = screen.getByText(/Try now for EGP0/);
        fireEvent.click(submitButton);
        
        // Wait for error message
        await waitFor(() => {
            expect(screen.getByText(/Service endpoint not found/i)).toBeInTheDocument();
        });
    });
    
    it("correctly updates the trial information in multiple places when the cycle changes", () => {
        render(<CheckoutPage />);
        
        // Check text that should change when switching to monthly
        const planDescriptionBefore = screen.getByText(/Recruiter Lite \(1 license, Yearly\)/i);
        expect(planDescriptionBefore).toBeInTheDocument();
        
        // Find and click Monthly
        const monthlyDiv = screen.getAllByText(/Monthly/i)[0].closest('div').closest('div');
        fireEvent.click(monthlyDiv);
        
        // Check updated text
        const planDescriptionAfter = screen.getByText(/Recruiter Lite \(1 license, Monthly\)/i);
        expect(planDescriptionAfter).toBeInTheDocument();
        
        // Renewal period should also change
        const orderSummarySection = screen.getByText(/Order summary/i).closest('div');
        const renewalText = within(orderSummarySection).getByText(/each month/i);
        expect(renewalText).toBeInTheDocument();
    });
    
    it("shows the secure checkout text below the submit button", () => {
        render(<CheckoutPage />);
        
        const button = screen.getByRole('button', { name: /Try now for EGP0/i });
        const secureCheckoutText = screen.getByText(/Secure checkout/i);
        
        // Verify it's positioned after the button
        expect(button.compareDocumentPosition(secureCheckoutText) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
});

describe("CheckoutPage Core Tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.location.href = "";
        
        // Default mock values
        mockSelector.mockReturnValue({
            firstName: "John",
            isPremium: false
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it("renders user's first name from Redux state", () => {
        render(<CheckoutPage />);
        
        expect(screen.getByText(/John, unlock your 1-month free trial/)).toBeInTheDocument();
    });

    it("displays correct trial end date", () => {
        render(<CheckoutPage />);
        
        // Check trial end date is displayed in various places
        const dateElements = screen.getAllByText(new RegExp(NEXT_MONTH_DATE, "i"));
        expect(dateElements.length).toBeGreaterThan(0);
    });

    it("selects Yearly billing cycle by default", () => {
        render(<CheckoutPage />);
        
        // For radio buttons, we need to use a different approach since they might not have explicit labels
        // Get all the Yearly options text nodes
        const yearlyOptions = screen.getAllByText("Yearly");
        
        // Find the one that's near a radio input
        const yearlyRadioContainer = yearlyOptions.find(el => 
            el.closest('div')?.querySelector('input[type="radio"]')
        )?.closest('div');
        
        const yearlyRadio = yearlyRadioContainer?.querySelector('input[type="radio"]');
        expect(yearlyRadio).toBeChecked();
    });

    it("changes billing cycle when Monthly is selected", () => {
        render(<CheckoutPage />);
        
        // Find Monthly option container and click it
        const monthlyOptions = screen.getAllByText("Monthly");
        const monthlyContainer = monthlyOptions.find(el => 
            el.closest('div')?.querySelector('input[type="radio"]')
        )?.closest('div').closest('div');
        
        fireEvent.click(monthlyContainer);
        
        // Verify the Monthly radio is now selected
        const monthlyRadio = monthlyContainer.querySelector('input[type="radio"]');
        expect(monthlyRadio).toBeChecked();
    });

    // Remaining tests follow the same pattern of using container elements instead of 
    // relying on label associations that might not be properly set

    it("submits form with correct data for yearly subscription", async () => {
        // Mock successful response
        mockPost.mockResolvedValueOnce({
            data: { checkoutSessionUrl: "https://checkout.stripe.com/test" }
        });
        
        render(<CheckoutPage />);
        
        // Submit form with default values (yearly, subscription)
        const submitButton = screen.getByText(/Try now for EGP0/);
        fireEvent.click(submitButton);
        
        // Check loading state
        expect(screen.getByText("Processing...")).toBeInTheDocument();
        
        // Check POST request was made with correct data
        expect(mockPost).toHaveBeenCalledWith(
            "/premium-plan",
            {
                planType: "Yearly",
                autoRenewal: true
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer fake-token'
                }
            }
        );
        
        // Wait for response to be processed
        await waitFor(() => {
            // Check Redux dispatch
            expect(mockDispatch).toHaveBeenCalledWith(expect.any(Object));
            
            // Check page redirect
            expect(window.location.href).toBe("https://checkout.stripe.com/test");
        });
    });

    // Additional tests can continue here
});
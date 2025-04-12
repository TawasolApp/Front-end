# 🔐 Authentication Directory

This directory contains all components and pages related to the authentication flow in TawasolApp.

## 📁 Directory Structure

```
Authentication/
├── WelcomePage.jsx              # Landing page for unauthenticated users
├── SignInPage.jsx               # User login page
├── SignUpPage.jsx               # User registration page
├── NamePage.jsx                 # User name collection during onboarding
├── LocationPage.jsx             # User location collection during onboarding
├── ExperiencePage.jsx           # User experience collection during onboarding
├── ForgotPasswordPage.jsx       # Password recovery initiation
├── NewPasswordPage.jsx          # Password reset page
├── VerifySignUpPage.jsx         # Email verification during signup
├── VerificationPendingPage.jsx  # Waiting for email verification
├── ChangeEmailPage.jsx          # Email change flow
├── Forms/                       # Form components used within authentication pages
│   └── ...
└── GenericComponents/           # Reusable authentication UI components
    └── AuthenticationHeader.jsx # Header component for auth pages
    └── ...
```

## 🔄 Authentication Flow

1. **New Users**:
   - WelcomePage → SignUpPage → VerifySignUpPage → NamePage → LocationPage → ExperiencePage → Main App

2. **Returning Users**:
   - WelcomePage → SignInPage → Main App

3. **Password Recovery**:
   - SignInPage → ForgotPasswordPage → NewPasswordPage → SignInPage

## 🛠️ Implementation Details

- Authentication pages are designed with consistent UI elements using components from `GenericComponents/`
- Form validation is handled in individual form components in the `Forms/` directory
- Pages connect to the authentication API endpoints through the Redux store

## 🔌 Integration

- These components integrate with the authentication slice in the Redux store
- Google OAuth integration is available for social sign-in

## 🧪 Testing

When writing tests for authentication components:
- Mock authentication API responses using files in `src/mocks`
- Test both success and failure authentication flows
- Ensure form validation works correctly for all inputs

## 📝 Development Guidelines

1. Maintain consistent styling across all authentication pages
2. Follow the project's naming convention (PascalCase for components)
3. Keep individual page components focused on UI and delegate business logic to hooks/Redux
4. Ensure all authentication errors are properly displayed to the user
import React from 'react';
import SignInForm from './components/SignInForm';

const SignInPage = () => {
  const handleSignIn = (formData) => {
    // Handle sign-in logic (e.g., API call)
    console.log('Sign In Data:', formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-lg">
        <SignInForm onSubmit={handleSignIn} />
      </div>
      <p className="mt-6 text-center text-gray-600 text-xl">
        New to Tawasol?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Join now
        </a>
      </p>
    </div>
  );
};

export default SignInPage;
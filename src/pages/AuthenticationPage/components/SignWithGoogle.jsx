import { getIconComponent } from "../../../utils";

const SignWithGoogle = () => {
  const GoogleGIcon = getIconComponent("google-g");

  return (
    <button
      type="button"
      className="w-full flex items-center justify-center bg-white text-gray-700 py-3 px-4 border-2 border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:border-black text-xl font-medium transition duration-200 ease-in-out"
    >
      <GoogleGIcon className="w-9 h-9 mr-3" />
      Sign in with Google
    </button>
  );
};

export default SignWithGoogle;

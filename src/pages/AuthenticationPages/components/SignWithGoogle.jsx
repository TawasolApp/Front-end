import { getIconComponent } from "../../../utils";

const SignWithGoogle = () => {
  const GoogleGIcon = getIconComponent("google-g");

  // TODO: implement social login
  return (
    <button
      type="button"
      className="
        w-full flex items-center justify-center gap-3
        py-3 px-4 rounded-full border-2 border-gray-300
        text-lg sm:text-xl font-medium
        bg-white text-gray-700 hover:bg-gray-50
        focus:outline-none focus:border-blue-500
        transition-all duration-200 ease-in-out
      "
    >
      <GoogleGIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      <span>Sign in with Google</span>
    </button>
  );
};

export default SignWithGoogle;

import { getIconComponent } from "../../../utils";

const SignWithGoogle = () => {
  const GoogleGIcon = getIconComponent("google-g");

  // TODO: implement social login
  return (
    <button
      type="button"
      className="
        w-full flex items-center justify-center gap-3
        py-3 sm:py-4 px-4 rounded-full border-2 border-cardBorder
        text-lg sm:text-xl font-medium
        bg-cardBackground text-textContent hover:bg-cardBackgroundHover
        focus:outline-none focus:border-itemBorderFocus
        transition-all duration-200 ease-in-out
      "
    >
      <GoogleGIcon className="w-6 h-6 sm:w-7 sm:h-7" />
      <span>Sign in with Google</span>
    </button>
  );
};

export default SignWithGoogle;

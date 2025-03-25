const BlueSubmitButton = ({ text, disabled }) => (
  <button
    type="submit"
    className={`
      w-full py-3 px-4 rounded-full text-lg sm:text-xl font-medium
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      transition-all duration-200 ease-in-out
      ${disabled
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
      }
    `}
    disabled={disabled}
  >
    {text}
  </button>
);

export default BlueSubmitButton;

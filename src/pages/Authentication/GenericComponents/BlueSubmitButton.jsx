const BlueSubmitButton = ({ text, disabled = false }) => (
  <button
    type="submit"
    className={`
      w-full py-3 px-4 rounded-full text-lg sm:text-xl font-medium
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-buttonSubmitEnable
      transition-all duration-200 ease-in-out
      ${
        disabled
          ? "bg-buttonSubmitDisable text-buttonSubmitDisabledText cursor-not-allowed"
          : "bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover text-buttonSubmitText shadow-sm hover:shadow-md"
      }
    `}
    disabled={disabled}
  >
    {text}
  </button>
);

export default BlueSubmitButton;

const BlueSubmitButton = ({ text, disabled = false, isLoading = false, loadingText = "Loading" }) => (
  <button
    type="submit"
    className={`
      w-full py-3 sm:py-4 px-4 rounded-full text-lg sm:text-xl font-medium
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-buttonSubmitEnable
      transition-all duration-200 ease-in-out
      ${
        disabled || isLoading
          ? "bg-buttonSubmitDisable text-buttonSubmitText cursor-not-allowed"
          : "bg-buttonSubmitEnable hover:bg-buttonSubmitEnableHover text-buttonSubmitText shadow-sm hover:shadow-md"
      }
    `}
    disabled={disabled || isLoading}
    aria-busy={isLoading}
  >
    {isLoading ? (
      <span className="flex items-center justify-center gap-1">
        {/* <span className="animate-spin font-semibold text-textContent">↻</span> */}
        <span className="font-semibold text-textContent">{loadingText}</span>
        <span className="animate-bounce mx-0.5 font-bold text-textContent">
          .
        </span>
        <span
          className="animate-bounce mx-0.5 font-bold text-textContent"
          style={{ animationDelay: "0.2s" }}
        >
          .
        </span>
        <span
          className="animate-bounce mx-0.5 font-bold text-textContent"
          style={{ animationDelay: "0.4s" }}
        >
          .
        </span>
      </span>
    ) : (
      text
    )}
  </button>
);

export default BlueSubmitButton;

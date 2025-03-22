const BlueSubmitButton = ({ text, disabled }) => {
  return (
    <button
      type="submit"
      className={`w-full bg-blue-700 text-white py-4 px-4 rounded-full focus:outline-none focus:border-2 focus:border-black text-2xl font-medium transition duration-200 ease-in-out ${
        disabled
          ? "bg-stone-200 !text-stone-400 cursor-not-allowed"
          : "bg-blue-700 hover:bg-blue-800"
      }`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default BlueSubmitButton;

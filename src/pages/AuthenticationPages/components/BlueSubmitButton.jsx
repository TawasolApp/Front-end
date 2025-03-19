const BlueSubmitButton = ({ text }) => {
  return (
    <button
      type="submit"
      className="w-full bg-blue-700 text-white py-4 px-4 rounded-full hover:bg-blue-800 focus:outline-none focus:border-2 focus:border-black text-2xl font-medium transition duration-200 ease-in-out"
    >
      {text}
    </button>
  );
};

export default BlueSubmitButton;

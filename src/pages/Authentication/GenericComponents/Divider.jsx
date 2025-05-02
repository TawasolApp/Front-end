const Divider = () => {
  return (
    <div className="flex items-center my-4">
      <div className="flex-grow border-t border-textPlaceholder text-textContent"></div>
      <span className="mx-4 text-textContent text-lg">or</span>
      <div className="flex-grow border-t border-textPlaceholder text-textContent"></div>
    </div>
  );
};

export default Divider;

const LoadingPage = () => {
  console.log("🔄 LoadingPage rendered");

  return (
    <div
      className="flex justify-center items-center h-screen"
      data-testid="loading-page"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-600 border-dotted"></div>
    </div>
  );
};
export default LoadingPage;

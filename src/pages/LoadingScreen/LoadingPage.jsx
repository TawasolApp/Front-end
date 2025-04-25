const LoadingPage = () => {
  return (
    <div 
      className="flex justify-center items-center h-screen bg-mainBackground"
      data-testid="loading-page"
    >
      <div className="relative w-32 h-32">
        {/* Central Orb */}
        <div className="absolute inset-0 animate-pulse">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 blur-md"></div>
        </div>

        {/* Spinning Ring */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="w-full h-full border-4 border-dashed border-blue-300/30 rounded-full"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 animate-float">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>

        {/* Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 font-bold text-lg">
            Tawasol
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;

import React, { useEffect, useRef, useState } from 'react';

const TRAIL_LIFETIME = 800; // milliseconds
const SPEED_MULTIPLIER = 4; // orbit speed
const UPDATE_INTERVAL = 16; // ~60FPS

const Meteor = ({ trail, x, y, tiltX, tiltY }) => {
  const now = Date.now();

  return (
    <div
      className="absolute"
      style={{
        width: '0px',
        height: '0px',
        left: '50%',
        top: '50%',
        transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Trail */}
      {trail.map((pos, idx) => (
        <div
          key={idx}
          className="absolute bg-gray-600 dark:bg-white blur-[1px]"
          style={{
            width: '1px',
            height: '1px',
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        ></div>
      ))}
      {/* Meteor Ball */}
      <div
        className="absolute w-2 h-2 rounded-full bg-gray-600 dark:bg-white shadow-md"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      ></div>
    </div>
  );
};

const LoadingPage = () => {
  const [meteors, setMeteors] = useState([]);
  const animationRef = useRef();

  const orbits = [
    { radius: 60, count: 3 },
    { radius: 90, count: 4 },
    { radius: 120, count: 5 },
    { radius: 150, count: 6 },
  ];

  useEffect(() => {
    const initialMeteors = [];

    orbits.forEach((orbit) => {
      for (let j = 0; j < orbit.count; j++) {
        initialMeteors.push({
          orbitRadius: orbit.radius,
          angleOffset: (360 / orbit.count) * j,
          tiltX: Math.random() * 20 - 10, // -10 to +10 degrees
          tiltY: Math.random() * 20 - 10, // -10 to +10 degrees
          trail: [],
        });
      }
    });

    setMeteors(initialMeteors);

    const update = () => {
      setMeteors(prevMeteors => {
        const now = Date.now();
        return prevMeteors.map(meteor => {
          const rad = ((now / (50 / SPEED_MULTIPLIER)) + meteor.angleOffset) * (Math.PI / 180);
          const x = meteor.orbitRadius * Math.cos(rad);
          const y = meteor.orbitRadius * Math.sin(rad);

          const newTrail = [...meteor.trail.filter(p => now - p.time < TRAIL_LIFETIME), { x, y, time: now }];
          return { ...meteor, trail: newTrail };
        });
      });
      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-mainBackground relative overflow-hidden" data-testid="loading-page">
      <div className="relative w-[500px] h-[500px]" style={{ perspective: '1200px' }}>
        {/* Central Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 animate-pulse tracking-wide">
            TAWASOL
          </span>
        </div>

        {/* Meteors */}
        {meteors.map((meteor, index) => {
          const now = Date.now();
          const rad = ((now / (50 / SPEED_MULTIPLIER)) + meteor.angleOffset) * (Math.PI / 180);
          const x = meteor.orbitRadius * Math.cos(rad);
          const y = meteor.orbitRadius * Math.sin(rad);

          return (
            <Meteor
              key={index}
              trail={meteor.trail}
              x={x}
              y={y}
              tiltX={meteor.tiltX}
              tiltY={meteor.tiltY}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LoadingPage;

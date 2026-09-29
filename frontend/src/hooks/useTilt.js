import { useState, useCallback } from 'react';

/**
 * Custom hook to generate 2.5D tilt transforms based on mouse movements
 * @param {number} maxTiltDeg Maximum rotation angle in degrees (default 12)
 * @returns {object} { style, handleMouseMove, handleMouseLeave }
 */
export function useTilt(maxTiltDeg = 10) {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback((e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (((y - centerY) / centerY) * -maxTiltDeg).toFixed(2);
    const rotateY = (((x - centerX) / centerX) * maxTiltDeg).toFixed(2);
    
    const glareX = ((x / rect.width) * 100).toFixed(1);
    const glareY = ((y / rect.height) * 100).toFixed(1);

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlarePosition({ x: glareX, y: glareY, opacity: 0.15 });
  }, [maxTiltDeg]);

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition({ x: 50, y: 50, opacity: 0 });
  }, []);

  return {
    tiltStyle: {
      transform,
      transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
      willChange: 'transform',
    },
    glareStyle: {
      background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glarePosition.opacity}), transparent 60%)`,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      borderRadius: 'inherit',
      transition: 'opacity 0.2s ease',
    },
    handleMouseMove,
    handleMouseLeave,
  };
}

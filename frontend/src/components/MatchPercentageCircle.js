import React, { useEffect, useState, useRef } from 'react';

const MatchPercentageCircle = ({ percentage }) => {
  const [offset, setOffset] = useState(220);
  const circleRef = useRef(null);

  const size = 80;
  const strokeWidth = 6;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius; // Full circle length

  useEffect(() => {
    // Ensure strokeDashoffset updates correctly
    const progressOffset = circumference - (percentage / 100) * circumference;
    setOffset(progressOffset);

    if (circleRef.current) {
      circleRef.current.style.transition = 'stroke-dashoffset 850ms ease-in-out';
    }
  }, [percentage]);

  return (
    <svg key={percentage} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background Circle */}
      <circle 
        cx={center} 
        cy={center} 
        r={radius} 
        stroke="#2c3e50" 
        strokeWidth={strokeWidth} 
        fill="none"
      />

      {/* Foreground Progress Circle */}
      <circle 
        ref={circleRef}
        cx={center} 
        cy={center} 
        r={radius} 
        stroke="green" 
        strokeWidth={strokeWidth} 
        strokeDasharray={circumference} 
        strokeDashoffset={offset} 
        strokeLinecap="round"
        fill="none"
        transform="rotate(-90 40 40)" // Fix rotation so it starts at the top
      />

      {/* Fixed Percentage Text Display */}
      <text 
        x={center} 
        y={center + 5} 
        textAnchor="middle" 
        fontSize="14px" 
        fontWeight="bold" 
        fill="white"
      >
        {percentage}%
      </text>
    </svg>
  );
};

export default MatchPercentageCircle;

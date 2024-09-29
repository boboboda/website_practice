import React, { useEffect, useState } from 'react';

interface CircularProgressProps {
  size: number;
  progress: number; // 0 to 100
  strokeWidth: number;
  color: string;
  trackColor: string;
  visitors: string; // 방문자 수
  label: string; // 텍스트 라벨
  type: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  progress,
  strokeWidth,
  color,
  trackColor,
  visitors,
  label,
  type,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 1000); // 1초 딜레이

    return () => clearTimeout(timer);
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedProgress / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <circle
        stroke={trackColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transition: 'stroke-dashoffset 0.75s ease-in-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      <text
        x="50%"
        y="45%"
        textAnchor="middle"
        fill={color}
        dominantBaseline="middle"
      >
        <tspan fontSize="2em">{visitors}</tspan>
        <tspan fontSize="1em" dx="0.4em" fill="#FFFFFF">{type}</tspan>
      </text>
      <text
        x="50%"
        y="70%"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="1.2em"
      >
        {label}
      </text>
    </svg>
  );
};

export default CircularProgress;
import React, { useEffect, useState } from 'react';
import CountUpComponent from './countUpComponent';

interface CircularProgressProps {
  size: number;
  progress: number;
  strokeWidth: number;
  color: string;
  trackColor: string;
  visitors: number;
  label: string;
  type: string;
  mounted: boolean;
  id: string;
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
  mounted,
  id,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 1000);

    return () => clearTimeout(timer);
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className={`relative size-[${size}px]`}>
      <svg width={size} height={size}>
        <circle
          stroke={trackColor}
          fill="#000000"
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
        <circle
          stroke="#4A4947"
          fill='transparent'
          strokeWidth='10'
          r={85}
          cx={size / 2}
          cy={size / 2}
          style={{
            opacity: 0.8,
            filter: 'blur(4px)'
          }}
        />
      </svg>
      <div className='size-full absolute flex flex-col items-center justify-center gap-3 top-[-5px]'> 
        <div className='flex flex-row gap-2 text-[25px]'>
          <CountUpComponent id={id} start={0} end={visitors} duration={3} mounted={mounted}/>
          <span>{type}</span>
        </div>
        <span>{label}</span>
      </div>
    </div>
  );
};

export default CircularProgress;
import React, { useEffect, useState } from 'react';
import CountUpComponent from './countUpComponent';
import '@/styles/svg.css'

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
  // icon: React.ReactNode;
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
    <div className={`relative w-[${size}px] h-[${size}px]`}>
      <svg width={size} height={size} className="transform -rotate-90 circular-progress-svg">
        <defs>
          <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle
          stroke={trackColor}
          fill="#000000"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        
        <circle
          stroke={`url(#gradient-${id})`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeLinecap="butt"
          style={{ 
            transition: 'stroke-dashoffset 0.75s ease-in-out, filter 0.75s ease',
            filter: 'drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.5))'
          }}
        />
      </svg>
      <div className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center'>
        <div className='flex flex-col items-center justify-center gap-1'>
          <div className='flex flex-row gap-1 text-3xl font-bold text-gray-500'>
            <CountUpComponent color={color} id={id} start={0} end={visitors} duration={3} mounted={mounted}/>
            <span>{type}</span>
          </div>
          <span className='text-sm text-white'>{label}</span>
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;

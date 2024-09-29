import React, { useState, useEffect } from 'react';
import CircularProgress from './CircularProgress';
import { updateVisitCounts, getTotalVisitCount } from './visitCounter';


const VisitCalcurateView: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);

  const [dailyVisitCount, setDailyVisitCount] = useState<number>(0);
  const [totalVisitCount, setTotalVisitCount] = useState<number>(0);
  const [operatingDays, setOperatingDays] = useState<number>(0);



  useEffect(() => {
    // Simulate an async progress update with a delay
    const timer = setTimeout(() => {
      setProgress(75);

      const { dailyVisitCount, totalVisitCount, operatingDays } = updateVisitCounts();
    setDailyVisitCount(dailyVisitCount);
    setTotalVisitCount(totalVisitCount);
    setOperatingDays(operatingDays)


    }, 1000); // 1초 딜레이
    return () => clearTimeout(timer);
  }, []);

  

  return (
    <div className='w-full flex flex-row gap-10 justify-center'>
      <CircularProgress
        size={200} // 원형 크기
        progress={progress}
        strokeWidth={15} // 원형 두께
        color="#4caf50"
        trackColor="#d9d9d9"
        visitors={`${dailyVisitCount}` } // 방문자 수
        label={'오늘 방문자 수'}
        type={'명'} // 텍스트 라벨
      />

      <CircularProgress
        size={200} // 원형 크기
        progress={progress}
        strokeWidth={15} // 원형 두께
        color="#4caf50"
        trackColor="#d9d9d9"
        visitors={`${totalVisitCount}` } // 방문자 수
        label={'총방문자 수'}
        type={'명'} // 텍스트 라벨
      />

<CircularProgress
        size={200} // 원형 크기
        progress={progress}
        strokeWidth={15} // 원형 두께
        color="#4caf50"
        trackColor="#d9d9d9"
        visitors={`${operatingDays}` } // 방문자 수
        label={'홈페이지 운영중'}
        type={'일째'} // 텍스트 라벨
      />
    </div>
  );
};

export default VisitCalcurateView;
"use client"

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with no SSR
const Lottie = dynamic(() => import('react-lottie-player'), {
  ssr: false,
  loading: () => <div>불러오는 중..</div> // 로딩 중에 표시할 컴포넌트
});

import lottieJson from '../../public/buyoungsil_Animation.json';

export default function Animation() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <p>Loading...</p>; // 초기 로딩 상태 표시
  }

  return (
    <Lottie
      play
      loop
      animationData={lottieJson}
    />

      // <img src="/antAnimation.gif" alt="Example GIF"/>
  
  );
}
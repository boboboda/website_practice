// 'use client'

// import { useEffect } from 'react';

export default function Loading() {
  // useEffect(() => {
  //   console.log('Component mounted and visible');
  // }, []);

  console.log('노트 로딩')

  return (
    <div className="w-full h-full flex items-center justify-center">
      <h1 className="text-white">노트 로딩중...</h1>
    </div>
  );
}
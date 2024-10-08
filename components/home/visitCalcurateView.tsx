"use client";

import React, { useState, useEffect, useRef } from "react";
import CircularProgress from "./CircularProgress";
import { updateVisitCounts, getTotalVisitCount } from "./visitCounter";

const VisitCalculateView: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);
  const [visitData, setVisitData] = useState({
    dailyVisitCount: 0,
    totalVisitCount: 0,
    operatingDays: 0
  });

  const animationTriggeredRef = useRef(false);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchVisitData = () => {
      const { dailyVisitCount, totalVisitCount, operatingDays } = updateVisitCounts();
      setVisitData({ dailyVisitCount, totalVisitCount, operatingDays });
    };

    fetchVisitData();
    const intervalId = setInterval(fetchVisitData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (scrollY > 250 && !animationTriggeredRef.current) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setProgress(75);
        setIsMounted(true);
        animationTriggeredRef.current = true; // 애니메이션이 트리거되었음을 표시
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [scrollY]);

  return (
    <div
      className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-0 justify-items-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : "50px"})`,
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      <CircularProgress
        size={200}
        progress={progress}
        strokeWidth={15}
        color="#624E88"
        trackColor="#d9d9d9"
        visitors={visitData.dailyVisitCount}
        label={"오늘 방문자 수"}
        type={"명"}
        mounted={isMounted}
        id="daily-visitors"
      />
      <CircularProgress
        size={200}
        progress={progress}
        strokeWidth={15}
        color="#C96868"
        trackColor="#d9d9d9"
        visitors={visitData.totalVisitCount}
        label={"총 방문자 수"}
        type={"명"}
        mounted={isMounted}
        id="total-visitors"
      />
      <CircularProgress
        size={200}
        progress={progress}
        strokeWidth={15}
        color="#FF885B"
        trackColor="#d9d9d9"
        visitors={visitData.operatingDays}
        label={"홈페이지 운영중"}
        type={"일째"}
        mounted={isMounted}
        id="operating-days"
      />
      <CircularProgress
        size={200}
        progress={progress}
        strokeWidth={15}
        color="#7695FF"
        trackColor="#d9d9d9"
        visitors={visitData.operatingDays}
        label={"총 가입자 수"}
        type={"명"}
        mounted={isMounted}
        id="total-users"
      />
    </div>
  );
};

export default VisitCalculateView;
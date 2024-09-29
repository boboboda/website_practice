// utils/visitCounter.ts

// 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
const getFormattedDate = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 두 날짜 간의 일수를 계산하는 함수
const getDaysBetweenDates = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 방문자 수와 총 방문자 수를 로컬 스토리지에 저장하고 증가시키는 함수
export const updateVisitCounts = (): { dailyVisitCount: number, totalVisitCount: number, operatingDays: number } => {
  const today = getFormattedDate();
  const lastVisitDate = localStorage.getItem('lastVisitDate');
  const visitCount = parseInt(localStorage.getItem('visitCount') || '0', 10);
  const totalVisitCount = parseInt(localStorage.getItem('totalVisitCount') || '0', 10);
  const hasVisitedToday = localStorage.getItem('hasVisitedToday');
  const startDate = '2024-01-01'; // 운영 시작 날짜를 고정

  let newVisitCount = visitCount;
  let newTotalVisitCount = totalVisitCount;

  if (lastVisitDate !== today) {
    // 새로운 날이면 방문 날짜를 갱신하고 일일 방문자 수를 초기화
    localStorage.setItem('lastVisitDate', today);
    newVisitCount = 1;
    localStorage.setItem('hasVisitedToday', 'true'); // 오늘 처음 방문
  } else {
    if (!hasVisitedToday) {
      // 같은 날이지만 새로운 방문자일 경우 일일 방문자 수를 증가
      newVisitCount = visitCount + 1;
      localStorage.setItem('hasVisitedToday', 'true'); // 오늘 처음 방문
    }
  }

  // 새로운 방문자일 경우 총 방문자 수를 증가
  if (!localStorage.getItem('hasVisited')) {
    newTotalVisitCount = totalVisitCount + 1;
    localStorage.setItem('hasVisited', 'true'); // 첫 방문 기록
  }

  localStorage.setItem('visitCount', newVisitCount.toString());
  localStorage.setItem('totalVisitCount', newTotalVisitCount.toString());
  localStorage.setItem('startDate', startDate); // 운영 시작 날짜 저장

  const operatingDays = getDaysBetweenDates(startDate, today);

  return {
    dailyVisitCount: newVisitCount,
    totalVisitCount: newTotalVisitCount,
    operatingDays: operatingDays
  };
};

// 총 방문자 수를 반환하는 함수
export const getTotalVisitCount = (): number => {
  return parseInt(localStorage.getItem('totalVisitCount') || '0', 10);
};

// 운영 일수를 반환하는 함수
export const getOperatingDays = (): number => {
  const startDate = '2024-01-01'; // 운영 시작 날짜를 고정
  const today = getFormattedDate();
  return getDaysBetweenDates(startDate, today);
};
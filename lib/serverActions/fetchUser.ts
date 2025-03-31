"use server"

import prisma from "@/lib/prisma"

export async function fetchLatestUserData(email: string) {
  console.log("서버 db 유저 로드 실행", email);
  
  if (!email) {
    console.log("No email provided");
    return null;
  }
  
  try {
    // Prisma를 사용하여 사용자 데이터 가져오기
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    console.log('user data:', user);
    
    if (!user) {
      console.log('User not found for email:', email);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    // 오류를 던지지 않고 null 반환
    return null;
  }
}
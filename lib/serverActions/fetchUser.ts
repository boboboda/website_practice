import prisma from "@/lib/prisma"

export async function fetchLatestUserData(email: string) {
  console.log("서버 db 유저 로드 실행")
  
  try {
    // Prisma를 사용하여 사용자 데이터 가져오기
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    console.log('user', user)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    return user;
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}
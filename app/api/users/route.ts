import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
   
    try {
        // MongoDB 대신 Prisma 사용
        const users = await prisma.user.findMany();

        const response = {
            message: `오 왠일로 성공`,
            data: users
        }
        return NextResponse.json(response, {status: 200});

    } catch (error) {
        console.error('데이터베이스 오류:', error);

        const response = {
            message: `실패다 이자식아`,
            data: '읎다'
        }
        return NextResponse.json(response, {status: 400});
    } finally {
        // 단일 요청 핸들러에서는 $disconnect()를 호출하지 않아도 됩니다.
        // Next.js API 라우트는 일반적으로 요청당 한 번 실행되기 때문입니다.
    }
}

// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from '@prisma/client';

// export async function GET(request: NextRequest) {
//   try {
//     console.log("API 요청 시작");
//     const prisma = new PrismaClient();
//     console.log("Prisma 클라이언트 생성됨");
    
//     // 간단한 쿼리 시도
//     console.log("데이터베이스 연결 시도 중...");
//     const count = await prisma.$queryRaw`SELECT 1`;
//     console.log("데이터베이스 연결 성공:", count);
    
//     return NextResponse.json({ message: "성공" });
//   } catch (error) {
//     console.error("API 오류:", error);
//     return NextResponse.json({ 
//       message: "오류 발생", 
//       error: error instanceof Error ? error.message : String(error) 
//     }, { status: 500 });
//   }
// }
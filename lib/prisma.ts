// lib/prisma.ts 파일
import { PrismaClient } from '@prisma/client'

// 동적으로 Database URL 생성
function getDatabaseUrl() {
  const host = process.env.POSTGRES_HOST;
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const database = process.env.POSTGRES_DATABASE;
  const port = process.env.POSTGRES_PORT || '5432';
  const ssl = process.env.POSTGRES_SSL === "true";
  
  const sslParam = ssl ? '?sslmode=no-verify' : '';
  
  return `postgresql://${user}:${password}@${host}:${port}/${database}${sslParam}`;
}

// Prisma 클라이언트 초기화
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
});

export default prisma;
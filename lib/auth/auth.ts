import pool from "@/lib/postgres";
import PgAdapter from "@auth/pg-adapter"
import GithubProvider from "@auth/core/providers/github";
import Google from "next-auth/providers/google"
import CredentialsProvider from "@auth/core/providers/credentials";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs' 
import { JWT } from "@auth/core/jwt";
import { Account, Session, User } from "@auth/core/types";
import NextAuth, { NextAuthResult } from "next-auth"

// MongoDB 관련 코드는 제거

export const { handlers, signIn, signOut, auth, unstable_update: update }: NextAuthResult = NextAuth(
    {
        providers: [
          Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
            authorization: {
              params: {
                prompt: 'consent'
              }
            }
          }),
          GithubProvider({
            clientId: 'Ov23libgyJ0ij1MsSEyS',
            clientSecret: '9e2f46265e1185c75714f04850cb25c85e3f3c3b',
            allowDangerousEmailAccountLinking: true,
          }),
          CredentialsProvider({
            // credentials 제공자 설정은 그대로 유지
            name: "credentials",
            credentials: {
                name: { label: "name", type: "text" },
                email: { label: "email", type: "email" },
                password: { label: "password", type: "password" },
                action: { label: "Action", type: "text" }
            },

            async authorize(credentials) {
              if (!credentials?.email || !credentials?.password || !credentials?.action) {
                throw new Error("Missing fields")
              }
      
              const { email, password, action, name } = credentials
              
              // PostgreSQL로 변경된 부분
              if (action === 'register') {
                try {
                  // 이메일 중복 체크
                  const existingUser = await pool.query(
                    'SELECT * FROM users WHERE email = $1', 
                    [email]
                  );
                  
                  if (existingUser.rows.length > 0) {
                    throw new Error("User already exists")
                  }
                  
                  // 비밀번호 해싱
                  const hashedPassword = await bcrypt.hash(password as string, 10)
                  
                  // 사용자 생성
                  const result = await pool.query(
                    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
                    [name, email, hashedPassword, 'user']
                  );
                  
                  const newUser = result.rows[0];
                  return { id: newUser.id, name: newUser.name, role: newUser.role, email: newUser.email }
                } catch (error) {
                  console.error("Register error:", error);
                  throw error;
                }
              } else if (action === 'login') {
                try {
                  // 사용자 찾기
                  const result = await pool.query(
                    'SELECT * FROM users WHERE email = $1',
                    [email]
                  );
                  
                  const user = result.rows[0];
                  if (!user) {
                    throw new Error("No user found")
                  }
                  
                  // 비밀번호 검증
                  const isValid = await bcrypt.compare(password as string, user.password)
                  if (!isValid) {
                    throw new Error("Invalid password")
                  }
                  
                  return { id: user.id, name: user.name, role: user.role, email: user.email }
                } catch (error) {
                  console.error("Login error:", error);
                  throw error;
                }
              }
      
              throw new Error("Invalid action")
            }
          }),
        ],
        
        session: {
            strategy: 'jwt',
            maxAge: 30 * 24 * 60 * 60 //30일
        },
    
        trustHost: true,
        callbacks: {
          async signIn({ user, account, profile }) {
            console.log(account?.provider, "소셜")

            if(account?.provider === "credentials") {
              return true
            }

            if(account?.provider === 'google' || 'github') {
              try {
                // 이메일로 기존 사용자 검색
                const existingUserResult = await pool.query(
                  'SELECT * FROM users WHERE email = $1',
                  [user.email]
                );
                
                const existingUser = existingUserResult.rows[0];
                
                if (existingUser) {
                  console.log('사용자가 존재함.')
                  
                  // 계정 연결 확인
                  const accountsResult = await pool.query(
                    'SELECT * FROM accounts WHERE user_id = $1 AND provider = $2',
                    [existingUser.id, account.provider]
                  );
                  
                  if (accountsResult.rows.length === 0) {
                    // 계정 연결이 없으면 추가
                    await pool.query(
                      'INSERT INTO accounts (user_id, provider, provider_account_id, refresh_token, access_token, expires_at) VALUES ($1, $2, $3, $4, $5, $6)',
                      [
                        existingUser.id, 
                        account.provider, 
                        account.providerAccountId,
                        account.refresh_token,
                        account.access_token,
                        account.expires_at
                      ]
                    );
                    
                    // 사용자 역할 업데이트
                    await pool.query(
                      'UPDATE users SET role = $1 WHERE id = $2',
                      ['user', existingUser.id]
                    );
                  }
                  
                  return true
                } else {
                  // 사용자가 없을 경우 새로 생성
                  console.log('사용자가 없음. oauth로 추가')
                  
                  // 새 사용자 생성
                  const newUserResult = await pool.query(
                    'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id',
                    [user.name, user.email, 'user']
                  );
                  
                  const newUserId = newUserResult.rows[0].id;
                  
                  // 계정 정보 추가
                  await pool.query(
                    'INSERT INTO accounts (user_id, provider, provider_account_id, refresh_token, access_token, expires_at) VALUES ($1, $2, $3, $4, $5, $6)',
                    [
                      newUserId, 
                      account.provider, 
                      account.providerAccountId,
                      account.refresh_token,
                      account.access_token,
                      account.expires_at
                    ]
                  );
                  
                  return true
                }
              } catch (error) {
                console.error('OAuth signIn error:', error);
                return false
              }
            }
            
            return true
          },
          
          // 나머지 콜백은 유지
          jwt: async ({ token, account, user, trigger, session }) => {
            // 기존 코드 유지
            if(account) {
              token.provider = account.provider;
            }

            if(user) {
                token.user = user;
            }

            if (trigger === 'update') {
              console.log('세션 업데이트')
              token= {...user, ...(session as User)}
            }

            return token;
          },
          
          session: async ({ session, token }: { session: any, token: JWT }) => {
            if (token.user) {
              // token.user에서 필요한 필드만 추출하여 session.user에 할당
              session.user = {
                ...session.user,
                id: token.user.id,
                name: token.user.name,
                email: token.user.email,
                role: token.user.role,
                // 필요한 경우 emailVerified 필드 추가
                emailVerified: token.user.emailVerified || null,
              };
            }
            return session;
          }
        },
        
        // MongoDB 어댑터 대신 PostgreSQL 어댑터 사용
        adapter: PgAdapter(pool),
        secret: process.env.NEXTAUTH_SECRET
    }
)
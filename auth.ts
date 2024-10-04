
import client from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GithubProvider from "@auth/core/providers/github";
import Google from "next-auth/providers/google"
import CredentialsProvider from "@auth/core/providers/credentials";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs' 
import { JWT } from "@auth/core/jwt";
import { Account, Session, User } from "@auth/core/types";
import NextAuth, { NextAuthResult } from "next-auth"
import GitHub from "@auth/core/providers/github";
import { profile } from "console";
import { Collection} from "mongodb";




interface UserInfo extends User {
  accounts?: string[];
}


export const { handlers, signIn, signOut, auth, unstable_update: update }: NextAuthResult  = NextAuth(
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
          })
          ,
            GithubProvider({
                clientId: 'Ov23libgyJ0ij1MsSEyS',
                clientSecret: '9e2f46265e1185c75714f04850cb25c85e3f3c3b',
                allowDangerousEmailAccountLinking: true,
            }),
           
            CredentialsProvider({
                //1. 로그인페이지 폼 자동생성해주는 코드 
                name: "credentials",
                credentials: {
                    name: { label: "name", type: "text" },
                    email: { label: "email", type: "email" },
                    password: { label: "password", type: "password" },
                    action: { label: "Action", type: "text" }
                },
    
                //2. 로그인요청시 실행되는코드
                //직접 DB에서 아이디,비번 비교하고 
                //아이디,비번 맞으면 return 결과, 틀리면 return null 해야함
                async authorize(credentials) {
                  if (!credentials?.email || !credentials?.password || !credentials?.action) {
                    throw new Error("Missing fields")
                  }
          
                  const { email, password, action, name } = credentials
                  const db = (await client).db('buyoungsilDb')
                  const usersCollection = db.collection('user_cred')
          
                  if (action === 'register') {
                    // 회원가입 로직
                    const existingUser = await usersCollection.findOne({ email })
                    if (existingUser) {
                      throw new Error("User already exists")
                    }
                    const hashedPassword = await bcrypt.hash(password as string, 10)
                    const result = await usersCollection.insertOne({ email, password: hashedPassword })
                    return { id: result.insertedId.toString(), name, email }
                  } else if (action === 'login') {
                    // 로그인 로직
                    const user = await usersCollection.findOne({ email })
                    if (!user) {
                      throw new Error("No user found")
                    }
                    const isValid = await bcrypt.compare(password as string, user.password)
                    if (!isValid) {
                      throw new Error("Invalid password")
                    }
                    return { id: user._id.toString(), name:user.name, email: user.email }
                  }
          
                  throw new Error("Invalid action")
                }
              }),
              
        ],
        
        //3. jwt 써놔야 잘됩니다 + jwt 만료일설정
        session: {
            strategy: 'jwt',
            maxAge: 30 * 24 * 60 * 60 //30일
        },
    

        callbacks: {
          async signIn({ user, account, profile }) {

            console.log(account?.provider, "소셜")

            if(account?.provider === 'google' || 'github' && account?.provider !== null) {

              const db = (await client).db("buyoungsilDb");
            const usersCollection: Collection<UserInfo> = db.collection("user_cred");
          
            console.log(user, "signIn Uuser")
            // 동일 이메일로 존재하는 사용자가 있는지 확인
            const existingUser = await usersCollection.findOne({ email: user.email });

            console.log('이메일 존재함', existingUser)
          
            if (existingUser) {
              // 사용자가 존재하지만 해당 OAuth 계정이 연결되어 있지 않다면 연결 처리

              console.log('사용자가 존재함.')
              if (!existingUser.accounts) {
                existingUser.accounts = [];
              }

          
          
              // 계정이 존재하면 OAuth 계정을 연결하는 로직
              if (!existingUser.accounts.includes(account.provider)) {
                await usersCollection.updateOne(
                  { email: user.email },
                  { $push: { accounts: account.provider } }
                );
              }
          
              return true

            } else {
              // 사용자가 없을 경우 새 사용자 생성
              console.log('사용자가 없음. oauth로 추가')
              await usersCollection.insertOne({
                email: user.email,
                name: user.name,
                accounts: [account.provider], // 새로 생성할 때 계정 추가
              });

              return true

            }
              
            }
            return true
          },
            jwt: async ({ token, account, user }: {account: Account, token: JWT, user?: User }) => {
              
              if(account) {
                token.provider = account.provider;
              }

                if(user) {
                    token.user = user;
                }
              return token;
            },
            
            // 세션 생성 시 사용자 정보 추가
            session: async ({ session, token }: { session: Session, token: JWT }) => {
              if (token.user) {
                // 세션에 토큰에서 가져온 사용자 정보 저장
                session.user = token.user;
              }
              return session;
            },

            // redirect: async ({ url, baseUrl }) => {
            //   if (url.startsWith('/')) return `${baseUrl}${url}`
            //   if (url) {
            //     const { search, origin } = new URL(url)
            //     const callbackUrl = new URLSearchParams(search).get('callbackUrl')
            //     if (callbackUrl)
            //       return callbackUrl.startsWith('/')
            //         ? `${baseUrl}${callbackUrl}`
            //         : callbackUrl
            //     if (origin === baseUrl) return url
            //   }
            //   return baseUrl
            // }
          },
          
        adapter: MongoDBAdapter(client),
        secret: process.env.NEXTAUTH_SECRET
    }
)


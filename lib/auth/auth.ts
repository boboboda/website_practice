// lib/auth/auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GithubProvider from "@auth/core/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "@auth/core/providers/credentials"
import bcrypt from 'bcryptjs'
import prisma from "@/lib/prisma"

export const { handlers, signIn, signOut, auth, unstable_update: update } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
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

        const { email, password, action, name } = credentials as {
          email: string;
          password: string;
          action: string;
          name?: string;
        };

        if (action === 'register') {
          // 사용자 등록 로직
          const existingUser = await prisma.user.findUnique({
            where: { email }
          });

          if (existingUser) {
            throw new Error("User already exists")
          }

          const hashedPassword = await bcrypt.hash(password, 10)

          const newUser = await prisma.user.create({
            data: {
              name,
              email,
              password: hashedPassword,
              role: 'user'
            }
          });

          return {
            id: newUser.id,
            name: newUser.name,
            role: newUser.role,
            email: newUser.email
          }
        } else if (action === 'login') {
          // 로그인 로직
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user || !user.password) {
            throw new Error("No user found")
          }

          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            throw new Error("Invalid password")
          }

          return {
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email
          }
        }

        throw new Error("Invalid action")
      }
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30일
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") {
        return true
      }

      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true }
          });

          if (existingUser) {
            // 계정 연결 확인 및 추가
            const linkedAccount = existingUser.accounts.find(
              acc => acc.provider === account.provider
            );

            if (!linkedAccount) {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token as string | null,
                  access_token: account.access_token as string | null,
                  expires_at: account.expires_at as number | null,
                  token_type: account.token_type as string | null,
                  scope: account.scope as string | null,
                  id_token: account.id_token as string | null,
                  session_state: account.session_state as string | null,
                }
              });

              // 사용자 역할 업데이트
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { role: 'user' }
              });
            }
          } else {
            // 새 사용자 생성
            const newUser = await prisma.user.create({
              data: {
                name: user.name,
                email: user.email,
                role: 'user',
                accounts: {
                  create: {
                    type: account.type || 'oauth',
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    refresh_token: account.refresh_token ? String(account.refresh_token) : null,
                    access_token: account.access_token ? String(account.access_token) : null,
                    expires_at: account.expires_at || null,
                    token_type: account.token_type ? String(account.token_type) : null,
                    scope: account.scope ? String(account.scope) : null,
                    id_token: account.id_token ? String(account.id_token) : null,
                    session_state: account.session_state ? String(account.session_state) : null
                  }
                }
              }
            });
          }

          return true
        } catch (error) {
          console.error('OAuth signIn error:', error);
          return false
        }
      }

      return true
    },

    jwt: async ({ token, account, user, trigger, session }) => {
      if (account) {
        token.provider = account.provider;
      }

      if (user) {
        token.user = user;
      }

      if (trigger === 'update') {
        token = { ...token, ...session };
      }

      return token;
    },

    session: async ({ session, token }) => {
      if (token.user) {
        session.user = {
          ...session.user,
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          role: token.user.role,
          // emailVerified: token.emailVerified || null,
        };
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
})
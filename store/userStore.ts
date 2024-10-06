import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import { Session, User } from "@auth/core/types"
import { getSession, updateSession } from "@/lib/serverActions/auth"
import { fetchLatestUserData } from '@/lib/serverActions/fetchUser'


export interface UserInfoActions {
  fetchSession: () => Promise<void>
  clearSession: () => void
}

export type UserStore = Session & UserInfoActions

export const defaultInitState: Session = {
  user: {
    name: '',
    email: '',
    role: ''
  },
  expires: '',
}

export const createUserStore = (initState: Session = defaultInitState) => {
  return createStore<UserStore>()(
    subscribeWithSelector((set, get) => ({
      ...initState,
      fetchSession: async () => {
        try {
          const session = await getSession()

          if (session) {
            // 세션이 존재하면 최신 사용자 데이터를 가져옵니다
            const latestUserData = await fetchLatestUserData(session.user.email)
            
            // 세션 데이터와 최신 데이터를 비교합니다
            const updatedUser = compareAndUpdateUserData(session.user, latestUserData)

            // 업데이트된 사용자 데이터로 상태를 설정합니다
            set({ user: updatedUser, expires: session.expires })

            // 세션이 변경되었다면 서버의 세션도 업데이트합니다
            if (JSON.stringify(updatedUser) !== JSON.stringify(session.user)) {
              await updateSession({ user: updatedUser })
            }
          } else {
            set({ ...defaultInitState })
          }
        } catch (error) {
          console.error("Failed to fetch session:", error)
          set({ ...defaultInitState })
        }
      },
      clearSession: () => set({ ...defaultInitState }),
    }))
  )
}

// 사용자 데이터를 비교하고 업데이트하는 함수
function compareAndUpdateUserData(sessionUser: User, latestData: User): User {
  const updatedUser = { ...sessionUser }
  let hasChanges = false

  for (const key in latestData) {
    if (latestData[key] !== sessionUser[key]) {
      updatedUser[key] = latestData[key]
      hasChanges = true
    }
  }

  return hasChanges ? updatedUser : sessionUser
}




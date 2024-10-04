import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'
import { Session, User } from "@auth/core/types"
import { getSession } from "next-auth/react"





export interface UserInfoActions {
  fetchSession: () => Promise<void>
  clearSession: () => void
}

export type UserStore = Session & UserInfoActions

export const defaultInitState: Session = {
  user: {
    name: '',
    email: '',
    rule: ''
  },
  expires: '',
}

export const createUserStore = (initState: Session = defaultInitState) => {
  return createStore<UserStore>()(
    subscribeWithSelector((set) => ({
      ...initState,
      fetchSession: async () => {
        try {
          const session = await getSession()
          if (session) {
            set({ user: session.user, expires: session.expires })
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




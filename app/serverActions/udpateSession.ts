"use server"

import client from "@/lib/mongodb"  // MongoDB 클라이언트 import
import { getSession, updateSession } from '@/app/serverActions/auth'

async function fetchLatestUserData(email: string) {

    console.log("여기까지 실행함")


  try {
    const db = (await client).db('buyoungsilDb')
    const usersCollection = db.collection('user_cred')

    const user = await usersCollection.findOne({ email } ,
        { projection: { password: 0 } })

        console.log('user', user)

    
    if (!user) {
      throw new Error('User not found')
    }

    console.log("잘가져옴")
    return {
      ...user
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}

export async function refreshUserSession() {
  console.log("두번째")

  const session = await getSession()

  if (session) {
    try {
      const updatedUserData = await fetchLatestUserData(session.user.email)

      console.log("세번째", updatedUserData)
      
      await updateSession({
        ...session,
        user: {
          ...session.user,
          ...updatedUserData,
        },
        expires: session.expires
      })

      return updatedUserData
    } catch (error) {
      console.error('Failed to refresh user session:', error)
      return null
    }
  }
  return null
}
'use server'

import client from "@/lib/mongodb"  // MongoDB 클라이언트 import
import { User } from "@auth/core/types"

export async function fetchLatestUserData(email: string) {

    console.log("서버 db 유저 로드 실행")


  try {
    const db = (await client).db('buyoungsilDb')
    const usersCollection = db.collection('user_cred')

    const user = await usersCollection.findOne<User>({ email } ,
        { projection: { password: 0, _id: 0 }  })

        console.log('user', user)

    
    if (!user) {
      throw new Error('User not found')
    }

    return {
      ...user,
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}
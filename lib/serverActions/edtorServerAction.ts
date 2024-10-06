import { Document } from './../extensions/Document/Document';
'use server'

import client from "@/lib/mongodb"  // MongoDB 클라이언트 import
import { User } from "@auth/core/types"
import { JSONContent } from '@tiptap/react';
import { Note } from "@/store/editorSotre"


export async function addEdtiorServer(note: string) {

    console.log("에디터서버 db 추가 실행")

    const notes: Note = JSON.parse(note)
    
    console.log(notes)
  try {
    const db = (await client).db('buyoungsilDb')
    const noteCollection = db.collection('developNote')

    const noteId =notes.noteId


    const noteData = await noteCollection.findOne<Note>({ noteId } ,
        { projection: { _id: 0 }  })

    if (noteData) {
      throw new Error('이미 존재하는 문서입니다.')
      console.log('데이터 없음')
    }

    
    
    const result = await noteCollection.insertOne({ notes });

    if(result.acknowledged) {

        return { success: true }

    } else {
        return { success: false }
    }
  } catch (error) {
    console.error('db 에러', error)
    throw error
  }
}


export async function AllFetchEdtiorServer() {

  console.log("에디터서버 db 로드 실행")

try {
  const db = (await client).db('buyoungsilDb');
    const usersCollection = db.collection('developNote');

    // `find` 메소드 호출과 `toArray` 호출을 분리
    const cursor = usersCollection.find({}, { projection: { _id: 0 }  });  // 모든 문서를 찾음
    const noteData = await cursor.toArray();  // 비동기로 모든 문서를 배열로 변환

    const dataParsing: Note[] =  noteData.map(db => db.notes)

    console.log('서버', dataParsing)
  

      return JSON.stringify(dataParsing)
} catch (error) {
  console.error('db 에러', error)
  throw error
}
}

import { Document } from '../extensions/Document/Document';
'use server'

import client from "@/lib/mongodb"  // MongoDB 클라이언트 import
import { User } from "@auth/core/types"
import { JSONContent } from '@tiptap/react';
import { Note } from "@/store/editorSotre"
import { parse } from 'path';


export async function addEdtiorServer(reqData: string) {

    console.log("에디터서버 db 추가 실행")

    const note: Note = JSON.parse(reqData)
    
  try {
    const db = (await client).db('buyoungsilDb')
    const noteCollection = db.collection('developNote')

    const noteId =note.noteId


    const noteData = await noteCollection.findOne<Note>({ "notes.noteId": noteId },
        { projection: { _id: 0 }  })

    if (noteData) {
      throw new Error('이미 존재하는 문서입니다.')
      console.log('데이터 없음')
    }

    
    
    const result = await noteCollection.insertOne({ note });

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


export async function allFetchEdtiorServer() {

  console.log("에디터서버 db 로드 실행")

try {
  const db = (await client).db('buyoungsilDb');
    const usersCollection = db.collection('developNote');

    // `find` 메소드 호출과 `toArray` 호출을 분리
    const cursor = usersCollection.find({}, { projection: { _id: 0 }  });  // 모든 문서를 찾음
    const noteData = await cursor.toArray();  // 비동기로 모든 문서를 배열로 변환

    const dataParsing: Note[] =  noteData.map(db => db.note)

    console.log('서버', dataParsing)
  

      return JSON.stringify(dataParsing)
} catch (error) {
  console.error('db 에러', error)
  throw error
}
}


export async function findOneEditorServer(noteId: string) {
  try {
    const db = (await client).db('buyoungsilDb')
    const noteCollection = db.collection('developNote')

    const numbericNoteId = parseInt(noteId);

    const noteData = await noteCollection.findOne(
      { "note.noteId": numbericNoteId },
      { projection: { _id: 0 } }
    )

    const note: Note = noteData.note

    console.log('server one data', noteData)

    if (!note) {
      return null
    }

    return JSON.stringify(note)
  } catch (error) {
    console.error('db 에러', error)
    throw error
  }
}


export async function findOneAndUpdateEditorServer(noteId: string, reqData: string) {
  try {
    const db = (await client).db('buyoungsilDb')
    const noteCollection = db.collection('developNote')

    const numbericNoteId = parseInt(noteId);
    
    const note = JSON.parse(reqData) 

    console.log("노트아이디", numbericNoteId)

    const updatedNoteData = await noteCollection.findOneAndUpdate({"note.noteId": numbericNoteId},
      { $set: {note: note}  },
      { projection: { _id: 0 } }
    )

    console.log('update one data', updatedNoteData)

    if (!updatedNoteData) {
      return { success: false }
    }

    return { success: true }
  } catch (error) {
    console.error('db 에러', error)
    return { success: false }
  }
}


export async function deleteOneEditorServer(noteId: string) {
  try {
    const db = (await client).db('buyoungsilDb')
    const noteCollection = db.collection('developNote')

    const numbericNoteId = parseInt(noteId);
    
    console.log("노트아이디", numbericNoteId)

    const result = await noteCollection.deleteOne({"note.noteId": numbericNoteId})

    console.log('delete one data', result.acknowledged)

    if(result.deletedCount === 1) {
      return { success: true }
    } else  {
      return { success: false }
    }

   
  } catch (error) {
    console.error('db 에러', error)
    return { success: false }
  }
}


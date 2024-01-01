import { NextRequest, NextResponse } from "next/server";
import  { fetchPosts, deleteAPost, editAPost} from "@/data/firestore";


// 할일 단일 조회
export async function GET(request: NextRequest,
     { params }: { params: { database: string, itemId: string  } }) {
   
  const res = {
    collection: params.database,
    id: params.itemId
}


console.log(`api ${JSON.stringify(res)}`)

const response = {
message: `단일 할일 가져오기 성공`,
data: res
}

    return NextResponse.json(res, {status: 200});
  }


  // 할일 단일 삭제: id
export async function DELETE(request: NextRequest,
    { params }: { params: { database: string, itemId: string } }) {

 // URL -> `/dashboard?search=my-project`
 // `search` -> 'my-project'

 const deletedTodo = await deleteAPost(params.database, params.itemId)
 
 if(deletedTodo === null) {
    return new Response(null, {status : 204});
 }

   const response = {
       message: `단일 할일 삭제 성공`,
       data: deletedTodo
       }


   return NextResponse.json(response, {status: 200});
 }


 // 할일 단일 수정
export async function POST(request: NextRequest,
    { params }: { params: { database: string, itemId: string } }) {


 // URL -> `/dashboard?search=my-project`
 // `search` -> 'my-project'

 const { title, password, content } = await request.json();

 const editedTodo = await editAPost(
  params.database, 
  params.itemId, 
  {title, password, content})

 if(editedTodo === null) {
    return new Response(null, {status : 204});
 }

   const response = {
       message: `단일 할일 수정 성공`,
       data: editedTodo
   }
   return NextResponse.json(response, {status: 200});
 }
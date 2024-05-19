import { NextRequest, NextResponse } from "next/server";
import  { fetchPosts, deleteAPost, editAPost} from "@/data/firebase";


// 게시글 단일 조회
export async function GET(request: NextRequest,
     { params }: { params: { database: string, itemId: string  } }) {
   
  const res = {
    collection: params.database,
    id: params.itemId
}


console.log(`api ${JSON.stringify(res)}`)

const response = {
message: `게시글 할일 가져오기 성공`,
data: res
}

    return NextResponse.json(res, {status: 200});
  }


  // 게시글 단일 삭제: id
export async function DELETE(request: NextRequest,
    { params }: { params: { database: string, itemId: string } }) {

 // URL -> `/dashboard?search=my-project`
 // `search` -> 'my-project'

 const deletedPost = await deleteAPost(params.database, params.itemId)
 
 if(deletedPost === null) {
    return new Response(null, {status : 204});
 }

   const response = {
       message: `단일 게시글 삭제 성공`,
       data: deletedPost
       }


   return NextResponse.json(response, {status: 200});
 }


 // 게시글 단일 수정
export async function POST(request: NextRequest,
    { params }: { params: { database: string, itemId: string } }) {


 // URL -> `/dashboard?search=my-project`
 // `search` -> 'my-project'

 const { title, password, content } = await request.json();

 const editedPost = await editAPost(
  params.database, 
  params.itemId, 
  {title, password, content})

 if(editedPost === null) {
    return new Response(null, {status : 204});
 }

   const response = {
       message: `단일 게시글 수정 성공`,
       data: editedPost
   }
   return NextResponse.json(response, {status: 200});
 }
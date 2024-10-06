import { NextRequest, NextResponse } from "next/server";
import  { fetchPosts, deleteAPost, editAPost, deleteAComment} from "@/lib/data/firebase";


// 할일 단일 조회
export async function GET(request: NextRequest,
     { params }: { params: { database: string, postId: string  } }) {
   
  const res = {
    collection: params.database,
    id: params.postId
}


console.log(`api ${JSON.stringify(res)}`)

const response = {
message: `단일 할일 가져오기 성공`,
data: res
}

    return NextResponse.json(res, {status: 200});
  }


  // 댓글 삭제: id
export async function DELETE(request: NextRequest,
    { params }: { params: { database: string, postId: string } }) {

      const commentIdParams = request.nextUrl.searchParams

      const commentId = commentIdParams.get('commentId')



 // URL -> `/dashboard?search=my-project`
 // `search` -> 'my-project'

 const deletedTodo = await deleteAComment(params.database, params.postId, commentId)
 
 if(deletedTodo === null) {
    return new Response(null, {status : 204});
 }

   const response = {
       message: `단일 할일 삭제 성공`,
       data: deletedTodo
       }


   return NextResponse.json(response, {status: 200});
 }
import { NextRequest, NextResponse } from "next/server";
import  { fetchPosts, deleteAPost, editAPost, deleteAComment, deleteAReply} from "@/data/firebase";



  // 답글 삭제: id
export async function DELETE(request: NextRequest,
    { params }: { params: { database: string, postId: string, commentId: string } }) {

      const replyIdParams = request.nextUrl.searchParams

      const replyId  = replyIdParams.get('replyId')



 // URL -> `/dashboard?search=my-project`
 // `search` -> 'my-project'

 const deletedReply = await deleteAReply(params.database, params.postId, params.commentId, replyId)
 
 if(deletedReply === null) {
    return new Response(null, {status : 204});
 }

   const response = {
       message: `단일 답글 삭제 성공`,
       data: deletedReply
       }


   return NextResponse.json(response, {status: 200});
 }
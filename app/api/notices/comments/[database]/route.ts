import { NextRequest, NextResponse } from "next/server";
import  { fetchPosts, deleteAPost, addAPost, addAComment} from "@/data/firestore";


  //댓글 추가
  export async function POST(request: NextRequest,
    { params }: { params: { database: string  } }) {
    
  
    const {
        postId,
        password,
        writer,
        content,
    } = await request.json();

        const addedcomment = await addAComment({
            collectionName: params.database,
            postId,
            commentPassword: password,
            commentWriter: writer,
            commentContent: content
        });

        const response = {
            message: `댓글 추가 성공`,
            data: addedcomment
        } 

        return NextResponse.json(response, {status: 201});
  }
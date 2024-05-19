import { NextRequest, NextResponse } from "next/server";
import { fetchPosts, deleteAPost, addAPost, addAComment, addAReply } from "@/data/firebase";


//답글 추가
export async function POST(request: NextRequest,
    { params }: { params: { database: string } }) {


    const {
        postId,
        personId,
        commendId,
        writer,
        password,
        content
    } = await request.json();

    //파이어베이스
    const addedcomment = await addAReply({
        collectionName: params.database,
        postId: postId,
        commentId: commendId,
        personId: personId,
        replyPassword: password,
        replyWriter: writer,
        replyContent: content
    })

    const response = {
        message: `댓글 추가 성공`,
        data: addedcomment
    }

    return NextResponse.json(response, { status: 201 });
}
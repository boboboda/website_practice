import { NextRequest, NextResponse } from "next/server";
import { fetchPosts, deleteAPost, addAPost } from "@/data/firebase";

// 모든 글 가져오기
export async function GET(request: NextRequest,
    { params }: { params: { database: string } }) {

        const formatDatabaseName = `${params.database}Notice`

    const fetchedPosts = await fetchPosts(formatDatabaseName);

    const response = {
        message: `posts 몽땅 가져오기`,
        data: fetchedPosts
    }


    return NextResponse.json(response, { status: 200 });
}



// 게시글 추가
export async function POST(request: NextRequest,
    { params }: { params: { database: string } }) {

    const formatDatabaseName = `${params.database}Notice`

    const {
        password,
        writer,
        title,
        content,
    } = await request.json();


    const addedPost = await addAPost({
        collectionName: formatDatabaseName,
        password,
        writer,
        title,
        content
    });

    const response = {
        message: `할일 추가 성공`,
        data: addedPost
    }

    return NextResponse.json(response, { status: 201 });
}
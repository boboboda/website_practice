import { NextRequest, NextResponse } from "next/server";
import  { fetchPosts, deleteATodo, editATodo, addAPost} from "@/data/firestore";
import { Content } from "next/font/google";

// 모든 글 가져오기
export async function GET(request: NextRequest,
     { params }: { params: { database: string  } }) {



      const fetchedPosts = await fetchPosts(params.database);

      const response = {
          message: `posts 몽땅 가져오기`,
          data: fetchedPosts
      }
  
  
      return NextResponse.json(response, {status: 200});
  }



  // 게시글 추가
  export async function POST(request: NextRequest,
    { params }: { params: { database: string  } }) {
    
  
    const data = await request.json();

    const post = {
        collectionName: params.database,
        title: data.title,
        passward: data.passward,
        writer: data.writer,
        content: data.content
    }

    console.log(`모달에서 들어온 값 writer${data.writer}, passward: ${data.passward}, title:${data.title}, content${data.content}`)

    if(post.title === undefined) {

        const errMessage = {
            message : '제목을 입력해주세요'
        } 

        return NextResponse.json(errMessage, {status: 422});
    }

    if(post.passward === undefined) {

        const errMessage = {
            message : '비밀번호을 입력해주세요'
        } 

        return NextResponse.json(errMessage, {status: 422});
    }

    if(post.writer === undefined) {

        const errMessage = {
            message : '이름을 입력해주세요'
        } 

        return NextResponse.json(errMessage, {status: 422});
    }

    if(post.content === undefined) {

        const errMessage = {
            message : '내용을 입력해주세요'
        } 

        return NextResponse.json(errMessage, {status: 422});
    }


    const addedPost = await addAPost({
        collectionName: params.database,
        passward: data.passward,
        writer: data.writer,
        title: data.title,
        content: data.content
    });

    console.log(`res${addedPost}`)

    const response = {
        message: `할일 추가 성공`,
        data: addedPost
    }

   
    return NextResponse.json(response, {status: 201});
  }
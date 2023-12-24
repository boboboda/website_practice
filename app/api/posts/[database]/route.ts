import { NextRequest, NextResponse } from "next/server";
import  { fetchPosts, deleteATodo, editATodo} from "@/data/firestore";


// 할일 단일 조회
export async function GET(request: NextRequest,
     { params }: { params: { database: string  } }) {



    return NextResponse.json(params.database, {status: 200});
  }


//   // 할일 단일 삭제: id
// export async function DELETE(request: NextRequest,
//     { params }: { params: { slug: string } }) {

//  // URL -> `/dashboard?search=my-project`
//  // `search` -> 'my-project'

//  const deletedTodo = await deleteATodo(params.slug)
 
//  if(deletedTodo === null) {
//     return new Response(null, {status : 204});
//  }

//    const response = {
//        message: `단일 할일 삭제 성공`,
//        data: deletedTodo
//        }


//    return NextResponse.json(response, {status: 200});
//  }


//  // 할일 단일 수정
// export async function POST(request: NextRequest,
//     { params }: { params: { slug: string } }) {


//  // URL -> `/dashboard?search=my-project`
//  // `search` -> 'my-project'

//  const { title, is_done } = await request.json();

//  const editedTodo = await editATodo(params.slug, {title, is_done})

//  if(editedTodo === null) {
//     return new Response(null, {status : 204});
//  }



  
//    const response = {
//        message: `단일 할일 수정 성공`,
//        data: editedTodo
//    }


//    return NextResponse.json(response, {status: 200});
//  }
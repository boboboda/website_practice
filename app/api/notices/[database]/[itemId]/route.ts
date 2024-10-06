import { NextRequest, NextResponse } from "next/server";
import { fetchPosts, deleteAPost, editAPost } from "@/lib/data/firebase";


// 공지사항 단일 조회
export async function GET(request: NextRequest,
  { params }: { params: { database: string, itemId: string } }) {

    const formatDatabaseName = `${params.database}Notice`

  const res = {
    collection: formatDatabaseName,
    id: params.itemId
  }


  console.log(`api ${JSON.stringify(res)}`)

  const response = {
    message: `단일 할일 가져오기 성공`,
    data: res
  }

  return NextResponse.json(res, { status: 200 });
}


// 공지사항 삭제: id
export async function DELETE(request: NextRequest,
  { params }: { params: { database: string, itemId: string } }) {

    const formatDatabaseName = `${params.database}Notice`

  const deletedNotice = await deleteAPost(formatDatabaseName, params.itemId)

  if (deletedNotice === null) {
    return new Response(null, { status: 204 });
  }

  const response = {
    message: `단일 할일 삭제 성공`,
    data: deletedNotice
  }


  return NextResponse.json(response, { status: 200 });
}


// 공지사항 수정
export async function POST(request: NextRequest,
  { params }: { params: { database: string, itemId: string } }) {

    const formatDatabaseName = `${params.database}Notice`

  const { title, password, content } = await request.json();

  const editedTodo = await editAPost(
    formatDatabaseName,
    params.itemId,
    { title, password, content })

  if (editedTodo === null) {
    return new Response(null, { status: 204 });
  }

  const response = {
    message: `단일 할일 수정 성공`,
    data: editedTodo
  }
  return NextResponse.json(response, { status: 200 });
}
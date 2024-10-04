import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/mongodb";


export async function GET(request: NextRequest) {
   
    try {
        const db  = (await client).db("buyoungsilDb")

        let result = await db.collection("users").find({}).toArray()

        const response = {
            message: `오 왠일로 성공`,
            data: result
        }
        return NextResponse.json(response, {status: 200});

    } catch (error) {
        console.error('데이터베이스 오류:', error);

        const response = {
            message: `실패다 이자식아`,
            data: '읎다'
        }
        return NextResponse.json(response, {status: 400});
    }
  }
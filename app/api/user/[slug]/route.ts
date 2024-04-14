import { Hello } from "@/app/lib/data"
import { NextResponse } from "next/server"


export async function GET(request: Request, { params }) {
    console.log('requested GET')
    const hello = new Hello();
    const userId = params.slug
    const userData = await hello.fetch(userId)
    console.log({ userData })
    return NextResponse.json(userData)
}
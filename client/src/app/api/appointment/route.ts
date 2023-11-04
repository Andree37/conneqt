import clientPromise from '@/lib/mongo'
import {NextRequest} from "next/server";

export async function POST(request: Request) {
    const client = await clientPromise
    const db = client.db('db')
    const res = await request.json()

    const document = await db.collection('appointment').insertOne(res)
    return new Response(JSON.stringify({document}), {status: 200})
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const pmeID = searchParams.get('pmeID')
    const client = await clientPromise
    const db = client.db('db')

    const document = await db.collection('appointment').find({pmeId: pmeID}).toArray()
    return new Response(JSON.stringify({document}), {status: 200})
}

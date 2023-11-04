import clientPromise from "@/lib/mongo";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    const client = await clientPromise;
    const db = client.db("db");
    const res = await request.json();
    const document = await db.collection("pme").insertOne(res);

    return NextResponse.json({document})
}

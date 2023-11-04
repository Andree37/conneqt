import clientPromise from "@/lib/mongo";
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
    const client = await clientPromise;
    const db = client.db("db");
    const res = await request.json();

    const password = Math.random().toString(36).slice(-8);

    const hash = bcrypt.hashSync(password, 10);

    const document = await db.collection("pme").insertOne({...res, password: hash});
    return new Response(JSON.stringify({document, password}), {status: 200})

}

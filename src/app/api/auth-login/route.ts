import clientPromise from "@/lib/mongo";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    const client = await clientPromise;
    const db = client.db("db");

    const {email, password} = await request.json();
    const user = await db.collection("pme").findOne({email});

    const matches = bcrypt.compareSync(password, user?.password)
    if (matches) {
        return new Response(JSON.stringify(user), {status: 200})
    } else {
        return new Response(JSON.stringify({error: 'email and password do not match'}), {status: 500})
    }
}

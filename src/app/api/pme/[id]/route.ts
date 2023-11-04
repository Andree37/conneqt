import clientPromise from "@/lib/mongo";
import {ObjectId} from "bson";

export async function GET(_: Request, {params}: { params: { id: string } }) {
    const client = await clientPromise;
    const db = client.db("db");

    const document = await db.collection("pme").findOne({_id: new ObjectId(params.id)});

    return new Response(JSON.stringify({document}), {status: 200})
}

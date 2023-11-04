import clientPromise from '@/lib/mongo'

export async function POST(request: Request) {
  const client = await clientPromise
  const db = client.db('db')
  const res = await request.json()

  const document = await db.collection('appointment').insertOne(res)
  return new Response(JSON.stringify({ document }), { status: 200 })
}

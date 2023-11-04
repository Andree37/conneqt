// mongodb.js

import {MongoClient, ServerApiVersion} from 'mongodb'

const uri = process.env.MONGODB_URI || ""


if (!process.env.MONGODB_URI) {
    throw new Error('Add Mongo URI to .env.local')
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})
const clientPromise = client.connect()


export default clientPromise as Promise<MongoClient>
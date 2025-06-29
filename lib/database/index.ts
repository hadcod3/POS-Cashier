import mongoose, { Mongoose } from 'mongoose'

const MONGODB_URL = process.env.MONGODB_URL

type CachedMongoose = {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

declare global {
  // Don't use `var` — just declare the shape of `global`
  let mongoose: CachedMongoose | undefined
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose?: CachedMongoose
}

let cached = globalWithMongoose.mongoose ?? { conn: null, promise: null }

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn
  if (!MONGODB_URL) throw new Error('MONGODB_URL is missing')

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      dbName: 'hadCashier',
      bufferCommands: false,
    }).catch((err) => {
      cached = { conn: null, promise: null }
      throw err
    })
  }

  cached.conn = await cached.promise
  globalWithMongoose.mongoose = cached

  return cached.conn
}

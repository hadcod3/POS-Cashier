import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: MongooseCache = (global as { mongoose?: MongooseCache }).mongoose || { 
  conn: null, 
  promise: null 
};

export const connectToDatabase = async () => {
    try {
        if (cached.conn) return cached.conn;

        if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

        cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
            dbName: 'hadCashier',
            bufferCommands: false,
            connectTimeoutMS: 10000, 
            socketTimeoutMS: 45000, 
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            retryReads: true
        })

        cached.conn = await cached.promise;
        
        return cached.conn;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

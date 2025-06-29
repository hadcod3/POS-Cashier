import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  throw new Error("❌ MONGODB_URL is not defined in environment variables");
}

const client = new MongoClient(MONGODB_URL);
const db = client.db();
 
export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {  
        enabled: true,
        autoSignIn: false
    },
});
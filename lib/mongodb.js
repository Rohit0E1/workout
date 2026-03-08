import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = "workout_tracker";

if (!MONGO_URI) {
  throw new Error("MONGODB_URI environment variable is not set");
}

let cached = global._mongo;
if (!cached) cached = global._mongo = { conn: null, promise: null };

export async function getDb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGO_URI, {
      maxPoolSize: 1,
    }).then((client) => {
      cached.conn = client.db(DB_NAME);
      return cached.conn;
    }).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  return cached.promise;
}


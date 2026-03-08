import { MongoClient } from "mongodb";

const MONGO_URI =
  "mongodb+srv://kumarrohit2512003_db_user:1wXQfNWd5RwwutWM@cluster0.ywvuxzc.mongodb.net/";
const DB_NAME = "workout_tracker";

let cached = global._mongo;
if (!cached) cached = global._mongo = { conn: null, promise: null };

export async function getDb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGO_URI).then((client) => {
      cached.conn = client.db(DB_NAME);
      return cached.conn;
    });
  }

  return cached.promise;
}

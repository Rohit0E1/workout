import { getDb } from "../../../lib/mongodb";
import { NextResponse } from "next/server";

const COLLECTION = "workoutLogs";
const DOC_ID = "user_default";

export async function POST(req) {
  try {
    const { logs } = await req.json();
    if (!logs || typeof logs !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const db = await getDb();
    await db.collection(COLLECTION).updateOne(
      { _id: DOC_ID },
      { $set: { logs, lastSynced: new Date().toISOString() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Sync error:", e);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

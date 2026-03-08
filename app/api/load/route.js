import { getDb } from "../../../lib/mongodb";
import { NextResponse } from "next/server";

const COLLECTION = "workoutLogs";
const DOC_ID = "user_default";

export async function GET() {
  try {
    const db = await getDb();
    const doc = await db.collection(COLLECTION).findOne({ _id: DOC_ID });
    return NextResponse.json({ logs: doc?.logs || {}, lastSynced: doc?.lastSynced || null });
  } catch (e) {
    console.error("Load error:", e);
    return NextResponse.json({ error: "Load failed" }, { status: 500 });
  }
}

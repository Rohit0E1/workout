import { getDb } from "../../../lib/mongodb";
import { NextResponse } from "next/server";

const COLLECTION = "workoutLogs";
const DOC_ID = "user_default";

export async function DELETE() {
  try {
    const db = await getDb();
    await db.collection(COLLECTION).deleteOne({ _id: DOC_ID });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Clear error:", e);
    return NextResponse.json({ error: "Clear failed" }, { status: 500 });
  }
}

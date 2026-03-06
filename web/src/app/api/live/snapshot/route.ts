import { NextResponse } from "next/server";
import { loadLiveSnapshot } from "@/lib/data";

export const revalidate = 0;

export async function GET() {
  const snapshot = await loadLiveSnapshot();
  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

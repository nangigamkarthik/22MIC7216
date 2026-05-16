import { NextResponse } from "next/server";
import { getPriorityInboxSnapshot } from "@/lib/notifications/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseLimit(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedLimit = Number(searchParams.get("n"));

  return Number.isInteger(requestedLimit) && requestedLimit > 0
    ? requestedLimit
    : 10;
}

export async function GET(request: Request) {
  try {
    const limit = parseLimit(request);
    const snapshot = await getPriorityInboxSnapshot(limit);
    return NextResponse.json(snapshot);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to build the priority inbox.",
      },
      { status: 502 },
    );
  }
}

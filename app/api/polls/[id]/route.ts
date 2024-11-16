import { adminDb } from "@/app/api/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pollRef = adminDb.collection('polls').doc(params.id);
    const pollDoc = await pollRef.get();

    if (!pollDoc.exists) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      );
    }

    const poll = {
      id: pollDoc.id,
      ...pollDoc.data()
    };

    return NextResponse.json(poll);
  } catch (error) {
    console.error('Error fetching poll:', error);
    return NextResponse.json(
      { error: "Failed to fetch poll" },
      { status: 500 }
    );
  }
}
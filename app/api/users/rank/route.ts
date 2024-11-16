import { adminDb } from "@/app/api/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { error: "Missing user ID" },
        { status: 400 }
      );
    }

    // Get all users ordered by tokens
    const usersRef = adminDb.collection('users');
    const snapshot = await usersRef
      .orderBy('tokensEarned', 'desc')
      .get();

    // Find user's position
    const userIndex = snapshot.docs.findIndex(doc => doc.id === uid);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return rank (1-based index)
    return NextResponse.json({ rank: userIndex + 1 });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return NextResponse.json(
      { error: "Failed to fetch user rank" },
      { status: 500 }
    );
  }
}
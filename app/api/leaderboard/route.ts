import { adminDb } from "@/app/api/lib/firebase-admin";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const usersRef = adminDb.collection('users');
    const snapshot = await usersRef
      .orderBy('tokensEarned', 'desc')
      .limit(3)
      .get();

    const topUsers = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        rank: index + 1,
        id: doc.id,
        points: data.tokensEarned,
        icon: index === 0 ? 'Crown' : 'Medal',
        iconColor:
          index === 0 ? 'text-yellow-500' :
          index === 1 ? 'text-zinc-300' :
          'text-amber-600'
      };
    });

    return NextResponse.json(topUsers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
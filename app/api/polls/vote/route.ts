import { adminDb } from "@/app/api/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { PollOption } from "@/lib/types/poll";

export async function POST(request: NextRequest) {
  try {
    const { pollId, optionId, userId } = await request.json();

    if (!pollId || !optionId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Start a transaction
    const result = await adminDb.runTransaction(async (transaction) => {
      // Get poll document
      const pollRef = adminDb.collection('polls').doc(pollId);
      const pollDoc = await transaction.get(pollRef);

      if (!pollDoc.exists) {
        throw new Error('Poll not found');
      }

      const pollData = pollDoc.data();
      if (!pollData) {
        throw new Error('Invalid poll data');
      }

      // Check if poll has ended
      if (new Date(pollData.endsAt._seconds * 1000) < new Date()) {
        throw new Error('Poll has ended');
      }

      // Check if user has already voted
      if (pollData.participants.includes(userId)) {
        throw new Error('User has already voted');
      }

      // Get user document
      const userRef = adminDb.collection('users').doc(userId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      if (!userData) {
        throw new Error('Invalid user data');
      }

      // Update poll document
      transaction.update(pollRef, {
        totalParticipants: FieldValue.increment(1),
        participants: FieldValue.arrayUnion(userId),
        options: pollData.options.map((option: PollOption) =>
          option.id === optionId
            ? { ...option, votes: (option.votes || 0) + 1 }
            : option
        )
      });

      // Update user document
      transaction.update(userRef, {
        tokensEarned: FieldValue.increment(pollData.reward),
        totalParticipations: FieldValue.increment(1),
        participatedPolls: FieldValue.arrayUnion(pollId),
        updatedAt: FieldValue.serverTimestamp()
      });

      return {
        reward: pollData.reward,
        newTotalTokens: userData.tokensEarned + pollData.reward
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit vote" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { adminDb } from "@/app/api/lib/firebase-admin";

export async function GET() {
  try {
    const pollsRef = adminDb.collection('polls');
    const snapshot = await pollsRef
      .where('endsAt', '>', new Date())
      .orderBy('endsAt', 'asc')
      .get();

    const activePolls = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(activePolls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json(
      { error: "Failed to fetch polls" },
      { status: 500 }
    );
  }
}

// Add this new endpoint to manage polls
export async function POST(request: Request) {
  try {
    const { polls } = await request.json();

    if (!Array.isArray(polls)) {
      return NextResponse.json(
        { error: "Input must be an array of polls" },
        { status: 400 }
      );
    }

    const batch = adminDb.batch();
    const createdPolls = [];

    for (const poll of polls) {
      // Create a new document reference
      const pollRef = adminDb.collection('polls').doc();

      // Format the poll data
      const newPoll = {
        ...poll,
        createdAt: new Date(),
        endsAt: new Date(poll.endsAt),
        participants: 0,
        options: poll.options.map((option: any) => ({
          ...option,
          votes: 0
        }))
      };

      // Add to batch
      batch.set(pollRef, newPoll);
      createdPolls.push({ id: pollRef.id, ...newPoll });
    }

    // Commit the batch
    await batch.commit();

    return NextResponse.json(createdPolls);
  } catch (error) {
    console.error('Error creating polls:', error);
    return NextResponse.json(
      { error: "Failed to create polls" },
      { status: 500 }
    );
  }
}
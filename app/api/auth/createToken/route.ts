import { adminAuth } from "@/app/api/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { error: "Missing user ID" },
        { status: 400 }
      );
    }

    const customToken = await adminAuth.createCustomToken(uid);

    return NextResponse.json({ token: customToken });
  } catch (error) {
    console.error('Error creating custom token:', error);
    return NextResponse.json(
      { error: "Failed to create custom token" },
      { status: 500 }
    );
  }
}
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user.model';
import { NextResponse } from 'next/server';

// GET: Get all users
export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch users", error }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId, isAdmin } = await req.json();

    if (!userId || typeof isAdmin !== "boolean") {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }
    await connectToDatabase();

    const adminCount = await User.countDocuments({ isAdmin: true })

    if (adminCount === 1 && isAdmin === false) {
      return NextResponse.json(
        { message: "At least one admin is required." },
        { status: 400 }
      )
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated", user });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ message: "Failed to update user", error }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectToDatabase();

    await User.deleteMany({});

    return new Response(JSON.stringify({ message: 'All Users deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('DELETE /api/users error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/chats/route.ts
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat.model';
import Message from '@/models/Message.model';
import { NextRequest, NextResponse } from 'next/server';
// Connect to MongoDB before handling requests
async function connectToDB() {
  try {
    await dbConnect();
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500 }
    );
  }
}

// GET: Retrieve chats or messages
export async function GET(req: NextRequest) {
  await connectToDB();

  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get('roomId'); // Query param for filtering messages
  const type = searchParams.get('type'); // To distinguish between chats and messages

  try {
    if (type === 'messages' && roomId) {
      // Retrieve messages filtered by roomId
      const messages = await Message.find({ roomId }).sort({ timestamp: 1 }); // Sort by timestamp ascending
      return NextResponse.json(messages, { status: 200 });
    } else {
      // Retrieve all chats
      const chats = await Chat.find();
      return NextResponse.json(chats, { status: 200 });
    }
  } catch (error) {
    console.error('Error in GET /api/chats:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve data' },
      { status: 500 }
    );
  }
}

// POST: Save a new message
export async function POST(req: NextRequest) {
  const dbConnection = await connectToDB();
  if (dbConnection instanceof NextResponse) return dbConnection;

  try {
    const { roomId, message, sender, timestamp } = await req.json();

    if (!roomId || !message || !sender) {
      return NextResponse.json(
        { error: 'Missing required fields: roomId, message, sender' },
        { status: 400 }
      );
    }

    const newMessage = new Message({
      roomId,
      message,
      sender,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    await newMessage.save();
    return NextResponse.json(
      { message: 'Message saved successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/chats:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}

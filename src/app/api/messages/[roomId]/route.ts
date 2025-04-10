import Message from '@/models/Message.model';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    console.log('--> Fetching messages!');
    await dbConnect();

    const { roomId } = await params;
    console.log('Room ID:', roomId);

    const messages = await Message.find({ roomId });

    return NextResponse.json({
      message: 'Messages fetched successfully',
      status: 200,
      messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { message: 'Failed to fetch messages', status: 500 },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    console.log('--> Posting new message!');
    await dbConnect();

    const { roomId } = params;
    const body = await request.json();
    const { sender, content } = body;

    if (!sender || !content) {
      return NextResponse.json(
        { message: 'Sender and content are required', status: 400 },
        { status: 400 }
      );
    }

    const newMessage = await Message.create({
      roomId,
      sender,
      content,
      timestamp: new Date(),
    });

    return NextResponse.json({
      message: 'Message sent successfully',
      status: 201,
      data: newMessage,
    });
  } catch (error) {
    console.error('Error posting message:', error);
    return NextResponse.json(
      { message: 'Failed to send message', status: 500 },
      { status: 500 }
    );
  }
}

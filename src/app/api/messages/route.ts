import dbConnect from '@/lib/db';
import Message from '@/models/Message.model';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('--> Dummy GET hit');

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    await dbConnect();

    const messages = await Message.find();

    console.log('Messages:', messages);

    return NextResponse.json({
      message: 'This is a dummy response',
      userId,
      messages,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: 'Something went wrong',
      status: 500,
    });
  }
}

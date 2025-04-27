/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Item from '@/models/Items.model';
import User from '@/models/User.model';
import dbConnect from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { addedBy: string } }
) {
  await dbConnect();

  try {
    const userId = params.addedBy;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'Invalid or missing userId' },
        { status: 400 }
      );
    }

    // Fetch items by userId
    const items = await Item.find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();

    if (!items.length) {
      return NextResponse.json(
        { message: 'No items found for this user', items: [] },
        { status: 200 }
      );
    }

    // Fetch the user details for the provided userId
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Map items to include user details
    const itemsWithUsers = items.map((item) => {
      const itemObj = item.toObject(); // Convert Mongoose document to plain object
      itemObj.userDetails = user.toObject(); // Add userDetails field
      return itemObj;
    });

    return NextResponse.json(itemsWithUsers, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/items/[addedBy]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

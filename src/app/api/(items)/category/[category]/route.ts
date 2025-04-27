/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Item from '@/models/Items.model';
import User from '@/models/User.model';

export async function GET(
  req: NextRequest,
  { params }: { params: { category: string } }
) {
  await dbConnect();
  const queryParams = await params;
  const categoryQuery = queryParams.category;

  console.log(categoryQuery);

  try {
    const items = await Item.find({ category: categoryQuery }).sort({
      createdAt: -1,
    });

    const userIds = [...new Set(items.map((item) => item.user.toString()))];

    // Fetch all users corresponding to the user IDs
    const users = await User.find({ _id: { $in: userIds } });

    // Create a map of userId -> user object for quick lookup
    const userMap = new Map(users.map((user) => [user._id.toString(), user]));

    // Map items to include the user object in a separate field (userDetails)
    const itemsWithUsers = items.map((item) => {
      const itemObj = item.toObject(); // Convert Mongoose document to plain object
      itemObj.userDetails = userMap.get(item.user.toString()) || null; // Add userDetails field
      return itemObj;
    });

    return NextResponse.json(itemsWithUsers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Item from '@/models/Items.model';
import User from '@/models/User.model';
import { auth } from '@/auth';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query')?.toLowerCase() || '';
    const category = searchParams.get('category')?.toLowerCase() || '';

    // Build the query for Items
    let itemsQuery = Item.find().sort({ createdAt: -1 });

    // Apply query search if provided
    if (query) {
      const queryWords = query.split(' ').filter((word) => word.length > 0);
      itemsQuery = itemsQuery.where({
        keywords: { $in: queryWords.map((word) => new RegExp(word, 'i')) },
      });
    }

    // Apply category filter if provided
    if (category) {
      itemsQuery = itemsQuery.where({
        category: new RegExp(category, 'i'),
      });
    }

    // Fetch items (user field will contain ObjectIds)
    const items = await itemsQuery.exec();

    // Extract all unique user IDs from the items
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
    console.error('Error in GET /api/items:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse multipart/form-data using NextRequest's formData()
    const formData = await req.formData();

    // Extract fields and files from FormData
    const fields: { [key: string]: string | string[] } = {};
    const files: { [key: string]: File | null } = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        fields[key] = value; // Handle text fields
      } else {
        files[key] = value; // Handle files (File objects)
      }
    }

    const {
      adTitle,
      description,
      price,
      name,
      phoneNumber,
      category,
      currency,
      street,
      city,
      state,
      country,
      postalCode,
      specifications,
      keywords,
    } = fields;

    // Generate keywords from adTitle
    const generatedKeywords = adTitle
      ? Array.from(
          new Set(typeof adTitle === 'string' ? adTitle.split(' ') : [])
        ).join(', ')
      : '';
    // Handle image uploads
    const uploadDir = path.join(process.cwd(), 'public/uploads/items');

    await fs.mkdir(uploadDir, { recursive: true });

    const imagePaths: string[] = [];
    for (let i = 1; i <= 3; i++) {
      const file = files[`image${i}`] as File | null;
      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
        const filePath = path.join(uploadDir, fileName);
        const arrayBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(arrayBuffer));
        imagePaths.push(`/uploads/items/${fileName}`);
      }
    }

    console.log('--> Image Paths:', imagePaths);

    const userId = new mongoose.Types.ObjectId(session?.user?.id);

    const newItem = new Item({
      user: userId,
      adTitle,
      description,
      price: price || '0',
      name,
      phoneNumber,
      currency: currency || 'PKR',
      category,
      street,
      city,
      state,
      country,
      postalCode,
      specifications: specifications ?? {},
      keywords: generatedKeywords + (keywords || ''),
      image1: imagePaths[0] || null,
      image2: imagePaths[1] || null,
      image3: imagePaths[2] || null,
    });

    await newItem.save();
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.log('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

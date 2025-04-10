/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Item from '@/models/Items.model';
import { auth } from '@/auth';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const item = await Item.findById(params.id);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Populate the user field with all details
    const updatedItem = await item.populate('user');
    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const item = await Item.findById(params.id);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Parse multipart/form-data
    const formData = await req.formData();
    const fields: { [key: string]: FormDataEntryValue } = {};
    const files: { [key: string]: File | null } = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files[key] = value; // Handle file uploads
      } else {
        fields[key] = value; // Handle text fields
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

    // Generate keywords from adTitle if provided
    const generatedKeywords = adTitle
      ? Array.from(new Set((adTitle as string).split(' '))).join(', ')
      : '';

    // Handle image uploads
    const uploadDir = path.join(process.cwd(), 'public/uploads/items');
    await fs.mkdir(uploadDir, { recursive: true });

    const updateData: any = {};
    const imagePaths: string[] = [];

    for (let i = 1; i <= 3; i++) {
      const file = files[`image${i}`];
      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
        const filePath = path.join(uploadDir, fileName);
        const arrayBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(arrayBuffer));
        imagePaths.push(`/uploads/items/${fileName}`);
      }
    }

    // Assign image paths to updateData
    if (imagePaths.length > 0) {
      updateData.image1 = imagePaths[0] || null;
      updateData.image2 = imagePaths[1] || null;
      updateData.image3 = imagePaths[2] || null;
    }

    // Update other fields if provided
    if (adTitle) updateData.adTitle = adTitle as string;
    if (description) updateData.description = description as string;
    if (price) updateData.price = parseFloat(price as string);
    if (name) updateData.name = name as string;
    if (phoneNumber) updateData.phoneNumber = phoneNumber as string;
    if (category) updateData.category = category as string;
    if (currency) updateData.currency = currency as string;
    if (street) updateData.street = street as string;
    if (city) updateData.city = city as string;
    if (state) updateData.state = state as string;
    if (country) updateData.country = country as string;
    if (postalCode) updateData.postalCode = postalCode as string;
    if (specifications)
      updateData.specifications = JSON.parse(specifications as string);
    if (keywords || generatedKeywords) {
      updateData.keywords = generatedKeywords + ((keywords as string) || '');
    }

    const updatedItem = await Item.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Item not found after update' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error: any) {
    console.log('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const item = await Item.findByIdAndDelete(params.id);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json(
      { message: 'Item deleted successfully' },
      { status: 204 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

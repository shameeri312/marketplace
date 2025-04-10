/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Item from '@/models/Items.model';

export async function GET(
  req: NextRequest,
  { params }: { params: { category: string } }
) {
  await dbConnect();

  try {
    const items = await Item.find({ category: params.category }).sort({
      createdAt: -1,
    });
    return NextResponse.json(items, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

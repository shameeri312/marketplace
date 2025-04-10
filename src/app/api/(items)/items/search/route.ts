/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Item from '@/models/Items.model';

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query')?.toLowerCase() || '';

    const items = query
      ? await Item.find({
          keywords: { $in: query.split(' ').map((q) => new RegExp(q, 'i')) },
        }).sort({ createdAt: -1 })
      : await Item.find().sort({ createdAt: -1 });

    return NextResponse.json(items, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

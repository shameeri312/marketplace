/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User.model';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'marketplace@143';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // Get token from cookies or headers
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided!' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded: any = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found!' }, { status: 404 });
    }

    // Return user data
    return NextResponse.json(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        // Add other fields as needed
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided!' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded: any = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found!' }, { status: 404 });
    }

    // Update user data
    const body = await req.json();
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        message: 'User updated successfully!',
        user: {
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

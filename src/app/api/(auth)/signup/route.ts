/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'marketplace@143';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { firstName, lastName, email, phoneNo, password, password2 } = body;

    // Check if passwords match
    if (password !== password2) {
      return NextResponse.json(
        { error: 'Passwords do not match!' },
        { status: 400 }
      );
    }

    // Check if user already exists
    // const existingUser = await User.findOne({ email });

    // if (existingUser) {
    //   return NextResponse.json(
    //     {
    //       created: false,
    //       mailAlreadyExist: true,
    //       activeUser: existingUser.isActive,
    //       message: `User with ${email} email already exists!`,
    //     },
    //     { status: 400 }
    //   );
    // }

    // Check password length
    if (password.length < 5) {
      return NextResponse.json(
        { created: false, message: 'Password is too short!' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username: firstName + lastName,
      email,
      firstName,
      lastName,
      phoneNo,
      password: hashedPassword,
      isActive: true,
      role: 'user',
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      SECRET_KEY,
      {
        expiresIn: '1d', // Token expires in 1 day
      }
    );

    // Return token and user data
    const response = NextResponse.json(
      {
        created: true,
        mailAlreadyExist: false,
        activeUser: true,
        message: 'Account created successfully!',
        token,
        user: {
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      },
      { status: 201 }
    );

    // Optionally, set token in HTTP-only cookie for security
    response.cookies.set('token', token, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      sameSite: 'strict', // Prevents CSRF
      maxAge: 86400, // 1 day in seconds
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

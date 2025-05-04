/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User.model';
import fs from 'fs/promises';
import path from 'path';
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
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// export async function PUT(req: NextRequest) {
//   await dbConnect();

//   try {
//     const token = req.headers.get('authorization')?.replace('Bearer ', '');

//     if (!token) {
//       return NextResponse.json(
//         { error: 'No token provided!' },
//         { status: 401 }
//       );
//     }

//     // Verify token
//     const decoded: any = jwt.verify(token, SECRET_KEY);
//     const user = await User.findById(decoded.userId);

//     if (!user) {
//       return NextResponse.json({ error: 'User not found!' }, { status: 404 });
//     }

//     // Update user data
//     const body = await req.json();
//     const updatedUser = await User.findByIdAndUpdate(
//       decoded.userId,
//       { $set: body },
//       { new: true, runValidators: true }
//     );

//     return NextResponse.json(
//       {
//         message: 'User updated successfully!',
//         user: {
//           email: updatedUser.email,
//           firstName: updatedUser.firstName,
//           lastName: updatedUser.lastName,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 401 });
//   }
// }

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    // Verify token
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided!' },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found!' }, { status: 404 });
    }

    // Parse FormData
    const formData = await req.formData();
    console.log('--> FormData:', formData);

    // Extract fields and files from FormData
    const fields: { [key: string]: string | string[] } = {};
    const files: { [key: string]: File | null } = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        fields[key] = value;
      } else {
        files[key] = value;
      }
    }

    console.log('--> Fields:', fields);

    // Handle single image upload
    const uploadDir = path.join(process.cwd(), 'public/uploads/profiles');
    await fs.mkdir(uploadDir, { recursive: true });

    const imagePaths: string[] = [];
    const file = files['photo'] as File | null;

    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const filePath = path.join(uploadDir, fileName);
      const arrayBuffer = await file.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      imagePaths.push(`/uploads/profiles/${fileName}`);
    }

    console.log('--> Image Paths:', imagePaths);

    // Prepare update data
    const updateData = {
      email: fields.email,
      firstName: fields.firstName,
      lastName: fields.lastName,
      phoneNo: fields.phoneNo,
      city: fields.city,
      country: fields.country,
      about: fields.about,
      gender: fields.gender,
      dateOfBirth: fields.dateOfBirth
        ? new Date(fields.dateOfBirth)
        : undefined,
      photo: imagePaths[0] || undefined, // Use the image path if available
    };

    // Remove undefined fields to avoid overwriting with undefined
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found!' }, { status: 404 });
    }

    // Return response
    return NextResponse.json({
      message: 'User updated successfully!',
      user: {
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phoneNo: updatedUser.phoneNo,
        photo: updatedUser.photo,
        city: updatedUser.city,
        country: updatedUser.country,
        about: updatedUser.about,
        gender: updatedUser.gender,
        dateOfBirth: updatedUser.dateOfBirth,
      },
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

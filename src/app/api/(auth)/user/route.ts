/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User.model';
import multer from 'multer';
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

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), 'public/uploads/profiles'),
    filename: (req, file, cb) => {
      const ext = file.originalname.split('.').pop()?.toLowerCase() || 'png';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
});

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

    // Parse form data with multer
    const formData = await new Promise((resolve, reject) => {
      upload.single('photo')(req as any, {} as any, (err: any) => {
        if (err) reject(err);
        resolve(req);
      });
    });

    const { body, file } = formData as any;

    // Handle image upload
    let photoPath = user.photo;
    if (file) {
      photoPath = `/uploads/profiles/${file.filename}`;
    }

    // Update user data
    const updateData = { ...body, photo: photoPath };
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
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
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

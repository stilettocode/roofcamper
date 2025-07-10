import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
import type { UploadApiResponse } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  // 🔒 Get the session to check who is uploading
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 🔎 Find the user in your DB to get their id
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const file = formData.get("file") as File;

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "roofcamper" },
      (err, result) => {
        if (err || !result) {
          reject(err || new Error("No result returned from Cloudinary."));
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });

  const slug = slugify(title || uploadResult.public_id, {
    lower: true,
    strict: true,
  });

  // ✅ Create artwork linked to this user
  const artwork = await prisma.artwork.create({
    data: {
      title,
      slug,
      imageUrl: uploadResult.secure_url,
      userId: user.id, // 🔑 associate artwork with user
    },
  });

  return NextResponse.json({ success: true, artwork });
}

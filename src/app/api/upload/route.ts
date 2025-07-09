import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
import type { UploadApiResponse } from "cloudinary";


const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
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
        }
        else resolve(result);
      }
    );
    stream.end(buffer);
  });

  const slug = slugify(title || uploadResult.public_id, {
    lower: true,
    strict: true,
  });

  const artwork = await prisma.artwork.create({
    data: {
      title,
      slug,
      imageUrl: uploadResult.secure_url,
    },
  });

  return NextResponse.json({ success: true, artwork });
}

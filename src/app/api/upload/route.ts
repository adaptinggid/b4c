import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import path from "path";
import fs from "fs";

const MAX_BYTES = 20 * 1024 * 1024; // 20MB

const ALLOWED_TYPES = [
  // Images
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "image/x-icon",
  "image/bmp",
  "image/tiff",
  // Documents & Media ("other uploads")
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/zip",
  "application/x-zip-compressed",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/mp3",
  "audio/aac",
  "audio/m4a",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Allow any standard image, document, audio, video or zip file
  const fileType = file.type || "application/octet-stream";
  const isAllowed =
    ALLOWED_TYPES.includes(fileType) ||
    fileType.startsWith("image/") ||
    fileType.startsWith("audio/") ||
    fileType.startsWith("video/") ||
    file.name.endsWith(".pdf") ||
    file.name.endsWith(".zip") ||
    file.name.endsWith(".md") ||
    file.name.endsWith(".txt");

  if (!isAllowed) {
    return NextResponse.json(
      { error: "Unsupported file type. Please upload an image, PDF, document, audio, or video file." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is larger than 20MB" }, { status: 400 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const isVercelBlobConfigured = typeof token === "string" && token.startsWith("vercel_blob_rw_");

  if (isVercelBlobConfigured) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`b4c/${session.user.id}/${Date.now()}-${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      });
      return NextResponse.json({ url: blob.url, name: file.name, size: file.size, type: file.type }, { status: 201 });
    } catch (err) {
      console.warn("Vercel Blob upload failed, falling back to local file storage:", err);
    }
  }

  // Fall back to local file storage under public/uploads
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, safeName);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    return NextResponse.json({ url: publicUrl, name: file.name, size: file.size, type: file.type }, { status: 201 });
  } catch (err: unknown) {
    console.error("Local file upload error:", err);
    const message = err instanceof Error ? err.message : "Failed to save file";
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}

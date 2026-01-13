import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('Upload error: No file in request');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('Upload request received:', { name: file.name, type: file.type, size: file.size });

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.error('Upload error: Invalid file type', file.type);
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, GIF, WEBP allowed.' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('Upload error: File too large', file.size);
      return NextResponse.json({ error: 'File too large. Max 10MB allowed.' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check if Cloudinary is configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      try {
        // Upload to Cloudinary
        console.log('Uploading to Cloudinary...');
        const url = await uploadToCloudinary(buffer);
        console.log('Cloudinary upload success:', url);
        return NextResponse.json({ url });
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed, falling back to local:', cloudinaryError);
        // Fall through to local storage
      }
    }

    // Fallback: Save locally
    console.log('Saving locally...');
    const { writeFile, mkdir } = await import('fs/promises');
    const path = await import('path');
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${randomStr}.${ext}`;

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;
    console.log('Local upload success:', url);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

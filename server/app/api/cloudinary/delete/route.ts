import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'Public ID is required' },
        { status: 400 }
      );
    }

    // Cloudinary delete API call
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = process.env.CLOUDINARY_API_SECRET; // You'll need to add this to your server .env

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${signature}`).toString('base64')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete from Cloudinary');
    }

    const result = await response.json();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
} 
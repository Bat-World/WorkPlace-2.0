import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: "UploadThing test endpoint",
    environment: {
      UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN ? "Set" : "Not set",
      UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET ? "Set" : "Not set",
      UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID ? "Set" : "Not set",
      NODE_ENV: process.env.NODE_ENV,
      UPLOADTHING_TOKEN_LENGTH: process.env.UPLOADTHING_TOKEN?.length || 0,
      UPLOADTHING_SECRET_LENGTH: process.env.UPLOADTHING_SECRET?.length || 0,
      UPLOADTHING_APP_ID_LENGTH: process.env.UPLOADTHING_APP_ID?.length || 0,
    },
    timestamp: new Date().toISOString(),
  });
} 
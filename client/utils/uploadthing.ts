import { generateReactHelpers } from "@uploadthing/react";

const uploadThingUrl = process.env.NEXT_PUBLIC_BACKEND_URL 
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploadthing`
  : "http://localhost:3001/api/uploadthing";

export const { useUploadThing, uploadFiles } = generateReactHelpers<any>({
  url: uploadThingUrl,
});

export const deleteUploadThingFile = async (fileKey: string): Promise<boolean> => {
  try {
    const deleteUrl = process.env.NEXT_PUBLIC_BACKEND_URL 
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploadthing/delete`
      : "http://localhost:3001/api/uploadthing/delete";

    const response = await fetch(deleteUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileKey }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete file");
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    return false;
  }
}; 
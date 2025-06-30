import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "../../server/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>({
  url: "http://localhost:3001/api/uploadthing",
});

export const deleteUploadThingFile = async (fileKey: string): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:3001/api/uploadthing/delete", {
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
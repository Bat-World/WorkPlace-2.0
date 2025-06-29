export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export const uploadToCloudinary = async (file: File | Blob, fileName?: string): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file, fileName);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file');
  }
};

export const uploadFileToCloudinary = async (file: File | Blob, fileName?: string): Promise<string> => {
  try {
    const result = await uploadToCloudinary(file, fileName);
    return result.secure_url;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const response = await fetch("http://localhost:3001/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
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
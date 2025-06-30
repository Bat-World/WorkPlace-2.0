import { createUploadthing, type FileRouter } from "uploadthing/server";
import { UTApi } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  taskAttachments: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
    pdf: { maxFileSize: "32MB", maxFileCount: 10 },
    text: { maxFileSize: "32MB", maxFileCount: 10 },
    video: { maxFileSize: "32MB", maxFileCount: 10 },
    audio: { maxFileSize: "32MB", maxFileCount: 10 },
    blob: { maxFileSize: "32MB", maxFileCount: 10 },
  })
    .middleware(async () => {
      return { uploadedAt: new Date() };
    })
    .onUploadComplete(async ({ metadata, file }: { metadata: any; file: any }) => {}),
  
  projectAvatars: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return { uploadedAt: new Date() };
    })
    .onUploadComplete(async ({ metadata, file }: { metadata: any; file: any }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

export const utapi = new UTApi();

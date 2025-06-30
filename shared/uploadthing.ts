// shared/uploadthing.ts
// This file re-exports types from the server without importing server-only code

// Import only the type, not the implementation
export type OurFileRouter = typeof import("../server/app/api/uploadthing/core").uploadRouter;

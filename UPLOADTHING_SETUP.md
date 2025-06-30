# UploadThing Setup in Monorepo

This document explains the UploadThing configuration in our client/server/shared monorepo structure.

## File Structure

```
├── client/
│   ├── utils/uploadthing.ts          # Client-side UploadThing helpers
│   └── tsconfig.json                 # Path mappings for monorepo
├── server/
│   ├── app/api/uploadthing/
│   │   ├── core.ts                   # Server-side UploadThing router
│   │   └── route.ts                  # Next.js API route handler
│   └── tsconfig.json                 # Path mappings for monorepo
├── shared/
│   └── uploadthing.ts                # Shared type definitions
└── tsconfig.json                     # Root TypeScript config
```

## Key Changes Made

### 1. Fixed Type Imports
- **Problem**: Server-only code was being imported in shared files, causing build errors
- **Solution**: Used `typeof import()` syntax to import only types, not implementation

### 2. Path Mappings
- Added path aliases in both client and server `tsconfig.json`:
  - `@shared/*` → `../shared/*`
  - `@server/*` → `../server/*` (client only)
  - `@client/*` → `../client/*` (server only)

### 3. Proper Type Exports
- **shared/uploadthing.ts**: Re-exports types from server without importing server code
- **server/core.ts**: Properly exports `FileRouter` type with `satisfies` keyword
- **client/utils/uploadthing.ts**: Imports types from shared file using path alias

## Usage

### Client Side
```typescript
import { useUploadThing, uploadFiles } from "@shared/uploadthing";

// Use in React components
const { startUpload } = useUploadThing("taskAttachments");
```

### Server Side
```typescript
import { uploadRouter } from "./core";

// Used in API routes
export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});
```

## Dependencies

Both `client/` and `server/` have `uploadthing` installed:
- `uploadthing`: Core package
- `@uploadthing/react`: React helpers (client only)

## Environment Variables

Make sure to set up your UploadThing environment variables in both client and server:

```env
# Server
UPLOADTHING_SECRET=your_secret_here
UPLOADTHING_APP_ID=your_app_id_here

# Client (if needed)
NEXT_PUBLIC_UPLOADTHING_URL=http://localhost:3001/api/uploadthing
```

## Troubleshooting

1. **Type Errors**: Ensure both client and server have `uploadthing` installed
2. **Path Resolution**: Check that `tsconfig.json` path mappings are correct
3. **Build Errors**: Make sure shared files only import types, not implementation 
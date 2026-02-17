// app/api/uploadthing/core.ts

import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  projectUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 10 },
    "model/gltf-binary": { maxFileSize: "128MB", maxFileCount: 1 },
    "model/gltf+json": { maxFileSize: "128MB", maxFileCount: 1 },
    "application/octet-stream": { maxFileSize: "128MB", maxFileCount: 1 }, // For .fbx, .obj
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload complete:", file);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

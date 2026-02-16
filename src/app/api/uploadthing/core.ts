// app/api/uploadthing/core.ts

import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  projectUploader: f({
    image: { maxFileSize: "16MB" },
    "application/octet-stream": { maxFileSize: "64MB" }, // for .fbx or .obj
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload complete:", file);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

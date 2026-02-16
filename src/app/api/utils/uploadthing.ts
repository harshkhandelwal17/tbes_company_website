// utils/uploadthing.ts
import { createUploadthing, type FileRouter } from "uploadthing/server";
import type { NextRequest } from "next/server";

const f = createUploadthing();

export const uploadRouter = {
  projectImageUploader: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(async ({ file }) => {
    console.log("Image uploaded:", file.url);
  }),
  projectModelUploader: f({ "application/octet-stream": { maxFileSize: "50MB" } }).onUploadComplete(async ({ file }) => {
    console.log("Model uploaded:", file.url);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

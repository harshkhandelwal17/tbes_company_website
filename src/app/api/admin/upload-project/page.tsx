// app/admin/upload-project/page.tsx (or wherever your admin page is)

"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function UploadProjectPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Upload Project</h1>

      <UploadButton<OurFileRouter, "projectUploader">
        endpoint="projectUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
}

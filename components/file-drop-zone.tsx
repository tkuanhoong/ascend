"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { errorToast } from "@/lib/toast";

interface FileDropZoneProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileDropZone = ({ onChange, endpoint }: FileDropZoneProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].ufsUrl);
      }}
      onUploadError={(error: Error) => {
        errorToast({ message: `${error?.message}` });
      }}
    />
  );
};

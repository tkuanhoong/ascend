"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { errorToast } from "@/lib/toast";
import { Dispatch, SetStateAction } from "react";

interface FileDropZoneProps {
  onChange: ({ url, name }: { url?: string; name?: string }) => void;
  endpoint: keyof typeof ourFileRouter;
  fileNameToRename?: string;
  onFileNameChange: Dispatch<SetStateAction<string>>;
  onUploadChange: Dispatch<SetStateAction<boolean>>;
}

export const FileDropZone = ({
  onChange,
  endpoint,
  fileNameToRename,
  onUploadChange,
}: FileDropZoneProps) => {
  return (
    <UploadDropzone
      content={{
        allowedContent() {
          return <></>;
        },
      }}
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res) {
          const { ufsUrl, name } = res[0];
          onChange({ url: ufsUrl, name });
        }
        onUploadChange(false);
      }}
      onUploadError={(error) => {
        if (error.message.includes("FileSizeMismatch")) {
          errorToast({ message: "File exceeds maxmimum file size" });
        } else {
          errorToast({ message: `${error?.message}` });
        }

        onUploadChange(false);
      }}
      onBeforeUploadBegin={(files: File[]) => {
        onUploadChange(true);

        return files.map((f: File) => {
          let fileName = f.name;
          const fileExtension = fileName.substring(fileName.lastIndexOf("."));

          if (fileNameToRename && fileNameToRename !== "") {
            fileName = fileNameToRename + fileExtension;
          }

          return new File([f], fileName, {
            type: f.type,
          });
        });
      }}
    />
  );
};

"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill-new/dist/quill.bubble.css";

interface EditorPreviewProps {
  value: string;
}

export const EditorPreview = ({ value }: EditorPreviewProps) => {
  // Avoid loading the editor on the server
  // Only load the editor when the component is mounted
  // Otherwise, we will have hydration errors
  // The editor is a large library and we don't want to load it on the server
  // We only want to load it on the client
  // This is why we use the dynamic import
  // We also use the useMemo hook to memoize the dynamic import
  // This is important for performance
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );

  return <ReactQuill theme="bubble" value={value} readOnly />;
};

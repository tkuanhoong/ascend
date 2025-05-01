"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill-new/dist/quill.snow.css";

interface EditorPanelProps {
  onChange: (value: string) => void;
  value: string;
}

export const EditorPanel = ({ onChange, value }: EditorPanelProps) => {
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

  return (
    <div className="bg-white rounded-md">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
};

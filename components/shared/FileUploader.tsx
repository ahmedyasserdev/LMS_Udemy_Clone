
"use client";

import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  onChange: (url?: string,) => void;
  endpoint: keyof typeof ourFileRouter;
};

const FileUploader = ({
  onChange,
  endpoint
}: FileUploadProps) => {

  const handleClientUploadComplete = (res : any) => {
    if (res && res.length > 0) {
      console.log(res , "uploaded")
      onChange(res[0].url);
    } else {
      console.error('Unexpected response from Uploadthing:', res);
    }
  };

  const handleUploadError = (error: Error) => {
    toast.error(error.message);
  };

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={handleClientUploadComplete}
      onUploadError={handleUploadError}
    />
  );
};

export default  FileUploader
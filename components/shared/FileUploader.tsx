"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface FileUploaderProps {
  onChange: (url?: string,) => void;
  label  : string ;
};

const FileUploader = ({
  onChange,
  label 
}: FileUploaderProps) => {

 
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
    
  };

  return (
    <CldUploadWidget uploadPreset="gbuzpxkh" onUpload={onUpload}>
    {({ open }) => {
      return (
        <Button type="button"  variant = "outline" onClick={() => open()} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
            {label}
        </Button>
      );
    }}
  </CldUploadWidget>
  );
};

export default  FileUploader
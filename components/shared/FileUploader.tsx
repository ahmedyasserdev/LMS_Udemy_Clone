'use client'

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing"
import toast from "react-hot-toast";


type FileUploadProps = {
    onChange: (url? : string) => void;
    endpoint : keyof typeof ourFileRouter
}

const FileUploader = ({onChange , endpoint} : FileUploadProps) => {
  return (
    <UploadDropzone
        endpoint= {endpoint}
        onClientUploadComplete={(res) => {
            onChange(res?.[0].url)
        }}

        onUploadError={(error : Error )=> {
          toast.error(`${error?.message}`)
        }}
    />  
  )
}

export default FileUploader
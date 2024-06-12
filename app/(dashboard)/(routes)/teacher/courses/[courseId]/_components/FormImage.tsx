"use client";

import { CoreFormProps } from "@/types";

import * as z from "zod";

import { Button } from "@/components/ui/button";

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { updateCourse } from "@/lib/actions/course.actions";
import { formImageSchema } from "@/lib/validations/formImageSchema";
import Image from "next/image";
import FileUploader from "@/components/shared/FileUploader";

const FormImage = ({ courseId, initialData }: CoreFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
 
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };
  const onSubmit = async (values: z.infer<typeof formImageSchema>) => {
    try {
      const courseToUpdate = await updateCourse({
        courseId,
        values,
        path: pathname,
      });

      if (courseToUpdate) {
        toggleEdit();
        toast.success("Course updated successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100  rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData?.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an Image
            </>
          )}
          {!isEditing && initialData?.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Image
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        !initialData.imageUrl ? (
          <div
          className={"flex items-center justify-center bg-slate-200 rounded-md  h-60"}
        >
          <ImageIcon  className = 'h-10 w-10 text-slate-500' />
        </div>
        )  : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        )
      )}

      {isEditing && (
       <div>
        <FileUploader
          endpoint = "courseImage"
          onChange = {(url) => {
            if (url) {onSubmit({imageUrl: url})}
          } }
        />

            <div className="text-xs text-muted-foreground mt-4">16:9 aspcet ratio recommended </div>


       </div>
      )}
    </div>
  );
};

export default FormImage;

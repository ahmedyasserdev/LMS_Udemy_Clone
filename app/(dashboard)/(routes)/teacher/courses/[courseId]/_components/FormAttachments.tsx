"use client";

import { CoreFormProps } from "@/types";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import {
  updateCourseAttachments,
  DeleteAttachment,
} from "@/lib/actions/course.actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import FileUploader from "@/components/shared/FileUploader";
import { Attachment, Course } from "@prisma/client";
type AttachmentFormProps = {
  initialData: Course & { attachments?: Attachment[] };
  courseId: string;
}

const FormAttachments = ({ courseId, initialData }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const formAttachmentsSchema = z.object({
    url: z.string().min(1 , {message : 'upload one attachment '})
  });


  const form = useForm<z.infer<typeof formAttachmentsSchema>>({
    resolver: zodResolver(formAttachmentsSchema),
    //@ts-ignore
    defaultValues:  initialData.attachments.map((attachment) => attachment.url) || '',
  });

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };
  const onSubmit = async (values: z.infer<typeof formAttachmentsSchema>) => {
    try {
      const courseToUpdate = await updateCourseAttachments({
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

  const onDelete = async (attachId: string) => {
    try {
      setDeletingId(attachId);
      await DeleteAttachment({attachId , courseId  : initialData.id});
      toast.success("Attachment deleted successfully");
      router.refresh();
    } catch (error: any) {
      toast.error("something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const  CourseAttachment = ({attach} : {attach : Attachment}) =>  
     (
      <div
      className="flex items-center w-full p-3 bg-sky-100 border-sky-200 text-sky-700  rounded-md"
    >
      <File className="h-4 w-4 mr-2 flex-shrink-0" />
      <p className="line-clamp-1  text-xs">{attach.name}</p>
  
      {deletingId === attach.id && (
        <div className = "ml-auto">
          <Loader2 className="h-4 w-4 animate-spin " />
        </div>
      )}
  
      {deletingId !== attach.id && (
        <button className="ml-auto"
          onClick={ () => onDelete(attach.id)}
        >
          <X className="h-4 w-4  opacity-75 transition" />
        </button>
      )}
    </div>
    )



  return (
    <div className="mt-6 border bg-slate-100  rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachments
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && <>Cancel</>}

          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments?.length === 0 ? (
            <p className="text-ms mt-2 italic text-slate-500">
              No Attachments yet{" "}
            </p>
          ) : (
            <div className="space-y-2">
              {initialData.attachments?.map((attach) => (
                <CourseAttachment
                
    key={attach.id}
                attach = {attach}
                />
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
             <Form {...form} >
           <form onSubmit={form.handleSubmit(onSubmit)} className = "flex items-center jusitfy-center gap-y-4 flex-col">
            <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
             
                <FormControl>
                  <FileUploader
                      onChange={(url) => field.onChange(url)}
                  label = "upload your attachments"
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
           <Button type="submit"  className = "w-full" >
           Save

            </Button>
          </form>
            </Form>

          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};

export default FormAttachments;





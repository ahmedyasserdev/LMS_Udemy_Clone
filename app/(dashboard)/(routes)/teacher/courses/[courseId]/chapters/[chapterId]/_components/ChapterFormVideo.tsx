"use client";

import { ChapterFormProps,  } from "@/types";
import MuxPlayer from '@mux/mux-player-react';
import * as z from "zod";

import { Button } from "@/components/ui/button";

import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import FileUploader from "@/components/shared/FileUploader";
import { updateChapter } from "@/lib/actions/chapter.actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
const ChapterFormVideo = ({ courseId, initialData  , chapterId}: ChapterFormProps  ) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
 
   const ChapterformVideoSchema = z.object({
    videoUrl: z.string().min(1, ),
  });
  const form = useForm<z.infer<typeof ChapterformVideoSchema>>({
    resolver: zodResolver(ChapterformVideoSchema),
    //@ts-ignore
    defaultValues:  initialData.videoUrl || '',
  });
  
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };
  const onSubmit = async (values: z.infer<typeof ChapterformVideoSchema>) => {
    try {
      const courseToUpdate = await updateChapter({
        courseId,
        chapterId,
        values,
        path: pathname,
      });
      console.log(values)

      if (courseToUpdate) {
        toggleEdit();
        toast.success("Chapter updated successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100  rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData?.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add  Video
            </>
          )}
          {!isEditing && initialData?.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Video
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        !initialData.videoUrl ? (
          <div
          className={"flex items-center justify-center bg-slate-200 rounded-md  h-60"}
        >
          <Video   className = 'h-10 w-10 text-slate-500' />
        </div>
        )  : (
          <div className="relative aspect-video mt-2">
                <MuxPlayer 
                  playbackId= {initialData?.muxData?.playbackId || ''}
                
                  streamType="on-demand"
                
                />
          </div>
        )
      )}

      {isEditing && (
       <div>
             <Form {...form} >
           <form onSubmit={form.handleSubmit(onSubmit)} className = "flex items-center jusitfy-center gap-y-4 flex-col">
            <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
             
                <FormControl>
                  <FileUploader
                      onChange={(url) => field.onChange(url)}
                  label = "upload your video"
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


            <div className="text-xs text-muted-foreground mt-4"> Upload this chatper&apos; vidoe</div>


       </div>
      )}


        {
          initialData.videoUrl && !isEditing &&(
            <div className="text-xs text-muted-foreground mt-2">
              Videos can take a few minutes to process. Refresh the page if video does not appear
            </div>
          )
        }

    </div>
  );
};

export default ChapterFormVideo;

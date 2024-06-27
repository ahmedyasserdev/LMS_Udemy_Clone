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

const ChapterFormVideo = ({ courseId, initialData  , chapterId}: ChapterFormProps  ) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
 
   const ChapterformVideoSchema = z.object({
    videoUrl: z.string().min(1, ),
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
        <FileUploader
          endpoint = "chapterVideo"
          onChange = {(url) => {
            if (url) {onSubmit({videoUrl: url})}
          } }
        />

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

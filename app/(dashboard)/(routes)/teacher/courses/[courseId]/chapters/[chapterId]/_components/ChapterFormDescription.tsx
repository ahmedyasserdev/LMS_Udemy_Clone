"use client";

import { ChapterFormProps, CoreFormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { updateChapter } from "@/lib/actions/chapter.actions";
import { Editor } from "@/components/shared/Editor";
import { Chapter } from "@prisma/client";
import { Preview } from "@/components/shared/Preview";

const ChapterFormDescription = ({ courseId, initialData , chapterId }: ChapterFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const pathname = usePathname()
  const chapterFormDescriptionSchema = z.object({
    description : z.string().min(0)
  })
  const form = useForm<z.infer<typeof chapterFormDescriptionSchema>>({
    resolver: zodResolver(chapterFormDescriptionSchema),
    defaultValues: {
      description : initialData.description || ''
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };
 
  const onSubmit = async (values: z.infer<typeof chapterFormDescriptionSchema>) => {
    try {

      const chapterToUpdate = await updateChapter({courseId  , chapterId, values , path : pathname});

      if (chapterToUpdate) {
        toggleEdit();
        form.reset();
        toast.success("Chpater updated successfully")
        router.refresh()
      }
      
    } catch (error) {
          toast.error("something went wrong")
    }
  };

 

  return (
    <div className="mt-6 border bg-slate-100  rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Description
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

            {
              !isEditing && (
                <div className={cn("text-sm mt-2" , !initialData.description && "text-slate-500 italic" )}>{!initialData.description && 'No Description' } 
                
                    {initialData.description && (<Preview  value={initialData.description} />)}
                
                 </div>
              )
            }




            {
              isEditing && (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>description</FormLabel>
                        <FormControl>
                          <Editor 
                          {...field} />
                        </FormControl>
                     
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                        <div className="flex items-center gap-x">
                  <Button type="submit"
                    disabled = {isSubmitting || !isValid}
                  >Save</Button>

                        </div>

                </form>
              </Form>
              )
            }


    </div>
  );
};

export default ChapterFormDescription;

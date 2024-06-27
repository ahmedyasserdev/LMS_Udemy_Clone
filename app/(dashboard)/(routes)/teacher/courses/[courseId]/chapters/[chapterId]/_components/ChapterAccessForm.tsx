"use client";

import { ChapterFormProps, CoreFormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { updateChapter } from "@/lib/actions/chapter.actions";
import { Checkbox } from "@/components/ui/checkbox";

const ChapterAccessForm = ({ courseId, initialData , chapterId }: ChapterFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const pathname = usePathname()
  const chapterAccessFormSchema = z.object({
    isFree : z.boolean().default(false)
  })
  const form = useForm<z.infer<typeof chapterAccessFormSchema>>({
    resolver: zodResolver(chapterAccessFormSchema),
    defaultValues: {
        isFree: !!initialData.isFree
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };
 
  const onSubmit = async (values: z.infer<typeof chapterAccessFormSchema>) => {
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
        Chapter access
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit access
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className={cn(
          "text-sm mt-2",
          !initialData.isFree && "text-slate-700 italic dark:text-slate-300"
        )}>
     
          {initialData.isFree ? (
            <>This chapter is available for free preview</>
          ) : (
            <>This chapter is not free.</>
          )}
        </p>
      )}


            {
              isEditing && (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange = {field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormDescription>
                              Check this box if you want to make this chapter free for preview.
                          </FormDescription>
                        </div>
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

export default ChapterAccessForm;

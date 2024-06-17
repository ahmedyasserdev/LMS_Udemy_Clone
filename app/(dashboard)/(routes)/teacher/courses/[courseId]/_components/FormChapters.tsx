"use client";

import { CoreFormProps } from "@/types";
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
import {  Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createChapter, updateChaptersReordering } from "@/lib/actions/chapter.actions";
import ChaptersList from "./ChaptersList";

const FormChapters = ({ courseId, initialData }: CoreFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const formChaptersSchema = z.object({
    title: z.string().min(1),
  });
  const form = useForm<z.infer<typeof formChaptersSchema>>({
    resolver: zodResolver(formChaptersSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const toggleCreating = () => {
    setIsCreating((prev) => !prev);
  };
  const onSubmit = async (values: z.infer<typeof formChaptersSchema>) => {
    try {
      await createChapter({
        courseId,
        title : values.title,
      });
        toggleCreating();
        form.reset();
        toast.success("chapter created successfully");
        router.refresh();
    } catch (error) {
      toast.error("something went wrong");
    }
  };



  const onReorder = async(updateData : {id : string ; position : number }[]) => {

    try {
          setIsUpdating(true);

          await  updateChaptersReordering({list : updateData , courseId});

          toast.success("Chapter reorderd");
          router.refresh
    } catch (error) {
      toast.error("Something went wrong");

    }finally {
        setIsUpdating(false)
    }
  }



  const onEdit =  (chapterId : string) => {
      router.push(`/teacher/courses/${courseId}/chapters/${chapterId}`)
  }

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800">

        {isUpdating && (
               <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
            <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
          </div>
        ) } 

      <div className="font-medium flex items-center justify-between">
        Course Chapters
        <Button onClick={toggleCreating} variant={"ghost"}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>chapter title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g 'Introduction to the course'"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting || !isValid}>
              Create
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData?.chapters?.length && "text-slate-500  italic"
          )}
        >
          {!initialData?.chapters?.length && "No Chapters"}

          <ChaptersList 
            onEdit = {onEdit}
            onReorder= {onReorder}
            items = {initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs mt-4 text-muted-foreground ">
          {" "}
          Drag and Drop to reorder the chapters{" "}
        </p>
      )}
    </div>
  );
};

export default FormChapters;

"use client";

import { FormCategoryProps } from "@/types";
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
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { updateCourse } from "@/lib/actions/course.actions";
import { cn } from "@/lib/utils";
import DropDown from "@/components/shared/DropDown";

const FormCategory = ({
  courseId,
  initialData,
  options,
}: FormCategoryProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
   const formCategorySchema = z.object({
    categoryId : z.string().min(1)
})
  const form = useForm<z.infer<typeof formCategorySchema>>({
    resolver: zodResolver(formCategorySchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formCategorySchema>) => {
    try {
      const courseToUpdate = await updateCourse({
        courseId,
        values,
        path: pathname,
      });

      if (courseToUpdate) {
        toggleEdit();
        form.reset();
        toast.success("Course updated successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };



 

  const selectedOption = options.find((option) => option.value === initialData.categoryId)
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800">
      <div className="font-medium flex items-center justify-between">
        Course category
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit category
            </>
          )}
        </Button>
      </div>
  
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DropDown 
                      {...field}
                      options = {options}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}

{!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.categoryId && "text-slate-500 italic"
          )}
        >
          {selectedOption?.label || "No category"}
        </p>
      )}


    </div>
  );
};

export default FormCategory;

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
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { updateCourse } from "@/lib/actions/course.actions";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const FormDescription = ({ courseId, initialData }: CoreFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const pathname = usePathname()
  const formDescriptionSchema = z.object({
  description : z.string().min(1 , {message : "Description is required"})
})
  const form = useForm<z.infer<typeof formDescriptionSchema>>({
    resolver: zodResolver(formDescriptionSchema),
    defaultValues: {
      description : initialData.description || ''
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };
  const onSubmit = async (values: z.infer<typeof formDescriptionSchema>) => {
    try {

      const courseToUpdate = await updateCourse({courseId , values , path : pathname});

      if (courseToUpdate) {
        toggleEdit();
        form.reset();
        toast.success("Course updated successfully")
        router.refresh()
      }
      
    } catch (error) {
          toast.error("something went wrong")
    }
  };

 

  return (
    <div className="mt-6 border bg-slate-100  rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Description
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
                <p className={cn("text-sm mt-2" , !initialData.description && "text-slate-500 italic" )}>{initialData.description || 'No Descriotion' }  </p>
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
                          <Textarea placeholder="e.g 'this course is about...'"
                            disabled = {isSubmitting}
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

export default FormDescription;

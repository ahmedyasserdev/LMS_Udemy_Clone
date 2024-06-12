"use client";

import { CoreFormProps } from "@/types";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formTitleSchema } from "@/lib/validations/formTitleSchema";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { updateCourse } from "@/lib/actions/course.actions";

const FormTitle = ({ courseId, initialData }: CoreFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const pathname = usePathname()
  const form = useForm<z.infer<typeof formTitleSchema>>({
    resolver: zodResolver(formTitleSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };
  const onSubmit = async (values: z.infer<typeof formTitleSchema>) => {
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
        Course Title
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
                <p className="text-sm mt-2">{initialData.title}</p>
              )
            }




            {
              isEditing && (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g 'Advaned web development'"
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

export default FormTitle;

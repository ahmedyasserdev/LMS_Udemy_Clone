"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

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
import { courseFormSchema } from "@/lib/validations/courseFormSchema";
import Link from "next/link";
import toast from "react-hot-toast";
import { createCourse } from "@/lib/actions/course.actions";

const CreateCoursesPage = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async(values: z.infer<typeof courseFormSchema>) => {

    try {
      const courseToCreate = await  createCourse({title : values.title});
        if (courseToCreate) {
          console.log(courseToCreate)
          form.reset();
          toast.success("course created")
          router.push(`/teacher/courses/${courseToCreate.id}`);
        }
    } catch  {
      toast.error("Something went wrong")
    }

  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g Advanced web development"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    what will you teach in this course
                  </FormDescription>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type = "button" variant={"ghost"}> Cancel</Button>
              </Link>


              <Button type = "submit"
                disabled = {!isValid  || isSubmitting }
              >Continue</Button>




            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCoursesPage;

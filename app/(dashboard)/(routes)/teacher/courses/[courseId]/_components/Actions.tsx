"use client";

import { ConfirmModal } from "@/components/shared/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import { deleteCourse, publishCourse, unpublishCourse } from "@/lib/actions/course.actions";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
type ActionsProps = {
  isPublished: boolean;
  disabled: boolean;
  courseId: string;
};

const Actions = ({
  isPublished,
  disabled,
  courseId,
}: ActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onDelete = async () => {
    try {
      setIsLoading(true)
      const courseToDelete = await deleteCourse(courseId,);
      if (courseToDelete) {
        toast.success("course Deleted");
        router.refresh();
        router.push(`/teacher/courses`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };


  const handleCoursePublishing = async () => {
    try { 

      setIsLoading(true);

      if (isPublished){
        await unpublishCourse(courseId);
        router.refresh()
        toast.success("Course Unpublished")
      }else {
        await publishCourse(courseId);
        router.refresh()
        toast.success("Course Published")
      }
      
    } catch (error) {
      toast.error("Something went wrong");
      
    }finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2 ">
      <Button
        onClick={handleCoursePublishing}
        size="sm"
        disabled={disabled || isLoading}
        variant="outline"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Actions;

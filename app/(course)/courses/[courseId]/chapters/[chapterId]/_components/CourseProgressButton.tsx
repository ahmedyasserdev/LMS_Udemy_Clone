"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState , useContext } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import confettiContext from "@/context/confetti-context";
import { updateProgress } from "@/lib/actions/progress.actions";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
};

 const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const {setIsOpen} = useContext(confettiContext);
    const [isLoading, setIsLoading] = useState(false);  


    const onClick = async () => {
      try {
          setIsLoading(true);

          await updateProgress({
            isCompleted : !isCompleted ,
            chapterId ,
            courseId ,
          })


          if (!isCompleted && !nextChapterId) {
              setIsOpen(true)
          }
          if (!isCompleted && nextChapterId) {
              router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
          }

          toast.success("Progress Updated")
          router.refresh()
      } catch (error) {
          toast.error("something went wrong")
      }finally {
        setIsLoading(false)
      }
    }

  const Icon = isCompleted ? XCircle : CheckCircle;
    return (
    <Button 
    type = "button"
    disabled = {isLoading}
    className = "w-full md:w-auto"
    variant = {isCompleted ? "outline" : "success"}
    onClick={onClick}
    
    >
            {isCompleted ?  "Not Completed" : "Mark as completed"}
                <Icon  className = "h-4 w-4 ml-2" />
    </Button>
  )
}

export default CourseProgressButton
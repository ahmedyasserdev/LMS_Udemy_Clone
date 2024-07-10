"use client";
import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type CourseSidebarItemProps = {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
};

const CourseSidebaeItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <button
    onClick = {onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2   font-[500] text-slate-500 pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-slate-700 bg-slate-200/20 hover:text-slate-700 hover:bg-slate-200/20",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isCompleted && isActive && "bg-emerald-200/20"
      )}
    >
      <div className="flex items-center gap-x-3 py-4">
        <Icon 
            size = {22}
            className={cn(
                "text-slate-500",
                isActive && "text-slate-700 dark:text-slate-300",
                isCompleted && "text-emerald-700 dark:text-emerald-400"
              )}
        
        /> {label}
      </div>

      <div className={cn(
         "ml-auto opacity-0 border-2 border-slate-700 h-[25px] transition-all ",
        isActive && "opacity-100",
        isCompleted && "border-emerald-700"
      )} />


    </button>
  );
};

export default CourseSidebaeItem;

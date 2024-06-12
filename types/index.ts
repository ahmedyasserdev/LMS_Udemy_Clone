import { Course } from "@prisma/client";
import { LucideIcon } from "lucide-react";

export type SidebarItemProps = {
  icon: LucideIcon;
  label: string;
  href: string;
};

export type CreateCourseParams = {
  title: string;
};



export type CoreFormProps = {
  initialData : Course
  courseId: string;
};
export type  FormCategoryProps = {
  initialData : Course
  courseId: string;
  options : {label : string ; value : string}[]
};

export type UpdateCourseParams = { courseId: string; path: string; values: {} };

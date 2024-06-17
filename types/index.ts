import { Attachment, Chapter, Course } from "@prisma/client";
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
  initialData : Course  & {attachments?: Attachment[]} & {chapters?: Chapter[]} ;
  courseId: string;
};
export type  FormCategoryProps = {
  initialData : Course
  courseId: string;
  options : {label : string ; value : string}[]
};

export type UpdateCourseParams = { courseId: string; path: string; values: {} };

export type UpdateCourseAttachmentsParams = { courseId: string; path: string; values: {url : string} };


export type createChapterParams = {courseId : string ; title  : string}


export type  ChapterListProps = {
  onEdit  : (id : string) => void
  items : Chapter[]
  onReorder : (updateData : {id : string ; position : number;}[]) => void
} 
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "../db";
import {
  CreateCourseParams,
  UpdateCourseParams,
  UpdateCourseAttachmentsParams,
} from "@/types";
import { revalidatePath } from "next/cache";

export const createCourse = async ({ title }: CreateCourseParams) => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return JSON.parse(JSON.stringify(course));
  } catch (error) {
    console.log("[COURSES]", error);
  }
};

export const updateCourse = async ({
  courseId,
  values,
  path,
}: UpdateCourseParams) => {
  try {
      const { userId } = auth();

      if (!userId) {
        throw new Error("Unauthorized");
      }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(course));
  } catch (error) {
    console.log("[UPDATE_COURSE]", error);
  }
};

export const updateCourseAttachments = async ({
  courseId,
  values,
  path,
}: UpdateCourseAttachmentsParams) => {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthorized");

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) throw new Error("Unauthorized");

    const attachment = await db.attachment.create({
      data: {
        url: values.url,
        name: values.url?.split("/").pop() || '',
        courseId,
      },
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(attachment));
  } catch (error) {
    console.log("[UPDATE_COURSE_ATTACHMENTS]", error);
  }
};



export const DeleteAttachment = async ({attachId  , courseId} : {attachId: string  , courseId  :string  }) => {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthorized");


const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) throw new Error("Unauthorized");

      const attachmentToDelete = await db.attachment.delete({
        where : {
          id : attachId ,
          courseId
        }
      })



      return JSON.parse(JSON.stringify(attachmentToDelete))

  } catch (error) {
    console.log("[DELETE_COURSE_ATTACHMENTS]", error);

  }
}
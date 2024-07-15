"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "../db";
import {
  CreateCourseParams,
  UpdateCourseParams,
  UpdateCourseAttachmentsParams,
  CourseWithProgressWithCategory,
  GetCourses,
} from "@/types";
import { revalidatePath } from "next/cache";
import Mux from "@mux/mux-node";
import { handleAuthorization } from "../utils";
import { z } from "zod";
import { getProgress } from "./progress.actions";

const courseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  categoryId: z.string(),
});

export const createCourse = async ({ title }: CreateCourseParams) => {
  try {
    const userId = await handleAuthorization();

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
    const userId = await handleAuthorization();

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
    await handleAuthorization(courseId);

    const attachment = await db.attachment.create({
      data: {
        url: values.url,
        name: values.url?.split("/").pop() || "",
        courseId,
      },
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(attachment));
  } catch (error) {
    console.log("[UPDATE_COURSE_ATTACHMENTS]", error);
  }
};

export const DeleteAttachment = async ({
  attachId,
  courseId,
}: {
  attachId: string;
  courseId: string;
}) => {
  try {
    await handleAuthorization(courseId);

    const attachmentToDelete = await db.attachment.delete({
      where: {
        id: attachId,
        courseId,
      },
    });

    return JSON.parse(JSON.stringify(attachmentToDelete));
  } catch (error) {
    console.log("[DELETE_COURSE_ATTACHMENTS]", error);
  }
};

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export const deleteCourse = async (courseId: string) => {
  try {
    const userId = await handleAuthorization();

    const course = await db.course.findUnique({
      where: { id: courseId, userId },
      include: {
        chapters: {
          include: { muxData: true },
        },
      },
    });

    if (!course) throw new Error("Not Found");

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await video.assets.delete(chapter?.muxData.assetId);
      }
    }

    const deleltedCourse = await db.course.delete({
      where: { id: courseId },
    });

    return JSON.parse(JSON.stringify(deleltedCourse));
  } catch (error) {
    console.log("[DELETE_COURSE]", error);
  }
};

export const publishCourse = async (courseId: string) => {
  try {
    const userId = await handleAuthorization();

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) throw new Error("Not Found");

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    const coursePublishingValidation = courseSchema.safeParse(course);
    if (!coursePublishingValidation.success || !hasPublishedChapter) {
      throw new Error("Missing Required Fields");
    }

    const courseToPublish = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return JSON.parse(JSON.stringify(courseToPublish));
  } catch (error) {
    console.log("[PUBLISH_COURSE]", error);
  }
};

export const unpublishCourse = async (courseId: string) => {
  try {
    const userId = await handleAuthorization();

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) throw new Error("Not Found");

    const coursePublishingValidation = courseSchema.safeParse(course);
    if (!coursePublishingValidation.success) {
      throw new Error("Missing Required Fields");
    }

    const courseToUnpublish = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });

    return JSON.parse(JSON.stringify(courseToUnpublish));
  } catch (error) {
    console.log("[UNPUBLISH_COURSE]", error);
  }
};

export const getCourses = async ({ userId, title, categoryId }: GetCourses) => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
          mode: "insensitive",
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }

        const progressPercentage = await getProgress({
          userId,
          courseId: course.id,
        });

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};

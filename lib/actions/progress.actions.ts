"use server";

import { db } from "../db";
import { handleAuthorization } from "../utils";

export const getProgress = async ({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}) => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: { id: true },
    });

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedChapters / publishedChapters.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};

export const updateProgress = async ({
  courseId,
  isCompleted,
  chapterId,
}: {
  isCompleted: boolean | undefined;
  courseId: string;
  chapterId: string;
}) => {
  try {
    const userId = await handleAuthorization();

    const userProgess = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });

    return JSON.parse(JSON.stringify(userProgess));
  } catch (error) {
    console.log("[UPDATING_PROGRESS]", error);
  }
};

"use server";

import { createChapterParams, updateChapterProps } from "@/types";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import Mux from "@mux/mux-node";
import { z } from "zod";
import { handleAuthorization } from "../utils";
import { Attachment, Chapter } from "@prisma/client";

const ChapterSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Description is required"),
  videoUrl: z.string().optional(),
  isPublished: z.boolean().optional(),
});

const MuxDataSchema = z.object({
  chapterId: z.string(),
  assetId: z.string().optional(),
  playbackId: z.string().optional(),
});

const PublishChapterSchema = z.object({
  chapter: ChapterSchema,
  muxData: MuxDataSchema.optional(),
});

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export const createChapter = async ({
  courseId,
  title,
}: createChapterParams) => {
  try {
    await handleAuthorization();

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId,
      },
      orderBy: { position: "desc" },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const newChapter = await db.chapter.create({
      data: {
        title,
        courseId,
        position: newPosition,
      },
    });

    return JSON.parse(JSON.stringify(newChapter));
  } catch (error) {
    console.log("[CHAPTERS]", error);
  }
};

export const updateChaptersReordering = async ({
  list,
  courseId,
}: {
  courseId: string;
  list: { id: string; position: number }[];
}) => {
  try {
    await handleAuthorization(courseId);

    for (const item of list) {
      await db.chapter.update({
        where: {
          id: item.id,
        },
        data: { position: item.position },
      });
    }
  } catch (error) {
    console.log("[CHAPTERS_UPDATING_POSITION]", error);
  }
};

export const updateChapter = async ({
  path,
  courseId,
  chapterId,
  values,
}: updateChapterProps) => {
  try {
    await handleAuthorization(courseId);

    const chapterToUpdate = await db.chapter.update({
      where: {
        id: chapterId,
      },
      data: { ...values },
    });

    if (values?.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      });

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await video.assets.create({
        input: [{ url: values.videoUrl }],
        playback_policy: ["public"],
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    revalidatePath(path);

    return JSON.parse(JSON.stringify(chapterToUpdate));
  } catch (error) {
    console.log("[CHAPTERS_UPDATING_VALUES]", error);
  }
};

export const deleteChapter = async ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  try {
    await handleAuthorization(courseId);

    const chapter = await db.chapter.findUnique({
      where: {
        courseId,
        id: chapterId,
      },
    });

    if (!chapter) throw new Error("Not Found");

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      });

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: { id: chapterId },
    });

    const publishedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!publishedChapterInCourse.length) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
    }

    return JSON.parse(JSON.stringify(deletedChapter));
  } catch (error) {
    console.log("[CHAPTER_DELETING]", error);
  }
};

export const publishChapter = async ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  try {
    await handleAuthorization(courseId);

    const muxData = await db.muxData.findUnique({
      where: { chapterId },
    });

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    });

    const parsedData = PublishChapterSchema.safeParse({
      chapter,
      muxData,
    });

    if (!parsedData.success) {
      throw new Error("Missing Required Fields");
    }

    const publishedChapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: {
        isPublished: true,
      },
    });

    return JSON.parse(JSON.stringify(publishedChapter));
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
  }
};

export const unpublishChapter = async ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  try {
    await handleAuthorization(courseId);

    const chapterToUnpublish = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: {
        isPublished: false,
      },
    });

    const publishedChapterInCourse = await db.chapter.findMany({
      where: { courseId, isPublished: true },
    });

    if (!publishedChapterInCourse.length) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
    }

    return JSON.parse(JSON.stringify(chapterToUnpublish));
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
  }
};

export const getChapter = async ({
  chapterId,
  userId,
  courseId,
}: {
  chapterId: string;
  userId: string;
  courseId: string;
}) => {
  try {
    const isPurchased = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },

      select: {
        price: true,
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!chapter || !course) throw new Error("Chapter or Course not found");

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if (isPurchased) {
      attachments = await db.attachment.findMany({
        where: {
          courseId,
        },
      });
    }

    if (chapter.isFree || isPurchased) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId,
        },
      });

      nextChapter = await db.chapter.findFirst({
        where: {
            courseId,
            isPublished: true,
            position: {
                gt: chapter?.position,
            },
        },
        orderBy: {
            position: "asc",
        },
    });

    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });
    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      isPurchased,
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      isPurchased: null,
    };
  }
};

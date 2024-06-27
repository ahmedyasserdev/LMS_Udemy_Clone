"use server";

import { createChapterParams, updateChapterProps } from "@/types";
import { db } from "../db";
import { revalidatePath } from "next/cache";
import Mux from "@mux/mux-node";
import { z } from "zod";
import { handleAuthorization } from "../utils";

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


    const publishedChapterInCourse = await db.chapter.findMany({where : {courseId , isPublished : true}});

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
}
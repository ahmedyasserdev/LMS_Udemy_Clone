"use server";

import { createChapterParams } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { db } from "../db";

export const createChapter = async ({
  courseId,
  title,
}: createChapterParams) => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) throw new Error("Unauthorized");

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
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) throw new Error("Unauthorized");

    for (let item of list) {
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

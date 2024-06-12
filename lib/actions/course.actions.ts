"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "../db";
import { CreateCourseParams, UpdateCourseParams } from "@/types";
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


export const updateCourse = async ({courseId , values , path } : UpdateCourseParams ) => {
     try {
        const {userId } = auth();

        if (!userId) {
            throw new Error("Unauthorized");
          }



          const course = await db.course.update({
            where: {
              id: courseId,
              userId,
            },
            data: {
                ...values
            },
          })

          revalidatePath(path)


          return JSON.parse(JSON.stringify(course))
     } catch (error) {
            console.log("[UPDATE_COURSE]",error)
     }
} 

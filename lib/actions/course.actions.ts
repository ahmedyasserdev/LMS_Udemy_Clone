'use server'

import { auth } from "@clerk/nextjs/server"
import { db } from "../db";
import { CreateCourseParams } from "@/types";



export const createCourse = async({title } : CreateCourseParams ) => {
    try {
        const {userId} = auth();

        if (!userId) {
            throw new Error("Unauthorized");
          }


                const course =await  db.course.create({
                    data : {
                        userId ,
                        title 
                    }
                });


                return JSON.parse(JSON.stringify(course))

    }catch (error) {
        console.log("[COURSES]" , error)
    }
}
import { auth } from "@clerk/nextjs/server"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { db } from "./db"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatPrice = (price: number ) => {
  return new Intl.NumberFormat("en-US" , {
    style   : 'currency',
    currency : "USD",
  }).format(price)
}


// Authorization function
export const handleAuthorization = async (courseId?: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
    if (courseId) {

      const isCourseOwner = await db.course.findUnique({
        where: {
          id: courseId,
          userId,
        },
      });
      
      if (!isCourseOwner) throw new Error("Unauthorized");
    }

  return userId;
};

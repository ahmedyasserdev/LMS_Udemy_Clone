import { getProgress } from "@/lib/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/CourseSidebar";
import CourseNavbar from "./_components/CourseNavbar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/");
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: { isPublished: true },
        include: { userProgress: { where: { userId } } },
        orderBy: { position: "asc" },
      },
    },
  });
  if (!course) return redirect("/");

  const progressCount = await getProgress({
    userId,
    courseId: params.courseId,
  });

  return (
    <div className="h-full">
          <div className="md:pl-64 fixed inset-y-0 w-full z-50 h-[80px]" >
            <CourseNavbar 
             course  = {course}
             progressCount = {progressCount}
            />
          </div>


        <div className="max-md:hidden  h-full  w-64 fixed inset-y-0 z-50">
          <CourseSidebar
            course = {course}
            progressCount = {progressCount} 
          
          />

        </div>
      
        <main className="md:pl-64 pt-[80px] h-full">
        {children}
      </main>

     </div>
  );
};

export default CourseLayout;

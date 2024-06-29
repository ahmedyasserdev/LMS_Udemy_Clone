import { IconBadge } from "@/components/shared/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import FormTitle from "./_components/FormTitle";
import FormDescription from "./_components/FormDescription";
import FormImage from "./_components/FormImage";
import FormCategory from "./_components/FormCategory";
import FormPrice from "./_components/FormPrice";
import FormAttachments from "./_components/FormAttachments";
import FormChapters from "./_components/FormChapters";
import Banner from "@/components/shared/Banner";
import Actions from "./_components/Actions";

const CourseDetailsPage = async ({
  params: { courseId },
}: {
  params: { courseId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId
    },
    include: {
      chapters : {
        orderBy : {position : 'asc'}
      } ,
      attachments: {
        orderBy : {createdAt : 'desc'}
      },
    },
  });


  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields= [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished)
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean)
  return (
  <>
    {
      !course.isPublished && (
        <Banner 
          variant={'warning'}
          label = "This course is unpublished. it will not be visible to the students"
        />
      )
    }
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course Setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields : {completionText}{" "}
            </span>
          </div>

      <Actions 
        isPublished  = {course.isPublished}
        courseId={course.id}
        disabled={!isComplete}
    
      />

        </div>
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <FormTitle initialData={course} courseId={course.id} />
            <FormDescription initialData={course} courseId={course.id} />
            <FormImage initialData={course} courseId={course.id} />
            <FormCategory
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
    
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
    
                <h2 className="text-x">Course Chapters</h2>
              </div>
            <FormChapters initialData={course} courseId={course.id} />
              
            </div>
    
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
    
                <h2 className="text-x">Sell Your Course</h2>
              </div>
    
              <FormPrice initialData={course} courseId={course.id} />
            </div>
    
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
    
                <h2 className="text-x">Resources & Attachments</h2>
              </div>
    
              <FormAttachments initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
  </>
  );
};

export default CourseDetailsPage;

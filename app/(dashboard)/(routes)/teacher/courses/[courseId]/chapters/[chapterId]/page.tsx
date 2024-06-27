import { IconBadge } from "@/components/shared/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ChapterFormTitle from "./_components/ChapterFormTitle";
import ChapterFormDescription from "./_components/ChapterFormDescription";
import ChapterAccessForm from "./_components/ChapterAccessForm";
import ChapterFormVideo from "./_components/ChapterFormVideo";
import Banner from "@/components/shared/Banner";
import ChapterActions from "./_components/ChapterActions";

const ChapterIdPage = async ({
  params: { courseId, chapterId },
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) return redirect("/");

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId,
    },
    include: {
      muxData: true,
    },
  });


  if (!chapter) return redirect("/");


  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean)
  return (
    <>
      {
        !chapter.isPublished && (
          <Banner 
            variant={'warning'}
            label="This chapter is unpublished. it will not be visible in he course"
          />
        )
      }

      <section className="p-6 overflow-hidden">
          <div className="w-full flex  items-center justify-between">
           <div>
             <Link
               href={`/teacher/courses/${courseId}`}
               className="text-sm flex items-center hover:opacity-75 transition mb-6"
             >
               <ArrowLeft className="h-4 mr-2 w-4" />
               Back to course setup
             </Link>
            
            
               <div className="flex flex-col gap-y-2">
                 <h1 className="text-2xl font-medium">Chapter Creation</h1>
                 <span className="text-sm text-slate-700">
                   Complete All Fields{completionText}
                 </span>
             </div>
           </div>
            <ChapterActions disabled = {!isComplete}
              courseId = {courseId}
              chapterId = {chapterId}
              isPublished = {chapter.isPublished}
            />
          </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-5">
             <div>
             <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
      
                <h2 className="text-xl">Cutomize your chapter</h2>
              </div>
      
                  <ChapterFormTitle 
                      initialData={chapter}
                      courseId = {courseId}
                      chapterId= {chapterId}
                  />
                  <ChapterFormDescription 
                      initialData={chapter}
                      courseId = {courseId}
                      chapterId= {chapterId}
                  />
             </div>
      
      
             <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">Access Settings</h2>
            </div>
      
          <ChapterAccessForm
             initialData={chapter} 
             courseId = {courseId}
             chapterId= {chapterId}
          />
      
          </div>
          </div>
      
      
        
      
          <div>
          <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a Video </h2>
            </div>
            <ChapterFormVideo
              initialData={chapter}
              courseId= {courseId}
              chapterId= {chapterId}
            />
          </div>
      
      
        </div>
      </section>
    </>
  );
};

export default ChapterIdPage;



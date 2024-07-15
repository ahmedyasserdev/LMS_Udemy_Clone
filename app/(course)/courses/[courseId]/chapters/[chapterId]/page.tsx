import Banner from "@/components/shared/Banner";
import { getChapter } from "@/lib/actions/chapter.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import VideoPlayer from "./_components/VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/shared/Preview";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/CourseProgressButton";

const ChapterIdpage = async ({
  params: { chapterId, courseId },
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) return redirect("/");
  const {
    chapter,
    attachments,
    course,
    muxData,
    isPurchased,
    nextChapter,
    userProgress,
  } = await getChapter({ userId, chapterId, courseId });


  if (!chapter || !course) return redirect("/");

  const isLocked = !chapter.isFree && !isPurchased;
  const completeOnEnd = !!isPurchased && !userProgress?.isCompleted;


  return (
    <div className="">
      {userProgress?.isCompleted && (
        <Banner
          variant={"success"}
          label="You already completed this chapter."
        />
      )}

      {isLocked && (
        <Banner
          variant={"warning"}
          label="You need to purchase this course to watch this chapter."
        />
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20 overflow-x-hidden">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>

        <div className="flex items-center justify-between flex-col md:flex-row p-4">
          <h2 className="font-semibold text-2xl mb-2">{chapter.title}</h2>

          {isPurchased ? (
                <CourseProgressButton
                  chapterId = {chapterId}
                  courseId = {courseId}
                  nextChapterId = {nextChapter?.id}
                  isCompleted = {!!userProgress?.isCompleted}
                />
) : (
            <CourseEnrollButton courseId={courseId} price={course.price!} />
          )}
        </div>

        <Separator />

        <div>
          <Preview value={chapter.description!} />
        </div>

        {!!attachments.length && (
          <>
            <Separator />
            <div className="p-4 space-y-4 ">
              {attachments.map((attachment) => (
                <a
                  href={attachment.url}
                  target="_blank"
                  key={attachment.id}
                  className=" rounded-md hover:underline flex gap-2 items-center p-3 w-full   bg-sky-200"
                >
                  <File />

                  <p className="line-clamp-1">{attachment.name}</p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterIdpage;

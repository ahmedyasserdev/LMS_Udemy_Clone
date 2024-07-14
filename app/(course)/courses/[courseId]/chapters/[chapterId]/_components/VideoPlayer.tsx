"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import confettiContext from "@/context/confetti-context";

type VideoPlayerProps = {
  playbackId?: string | null;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
};

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const { setIsOpen, isOpen } = useContext(confettiContext);
  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute flex items-center inset-0 justify-center bg-slate-800">
          <Loader2 className="h-8 w-8  animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute flex items-center inset-0 justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8  " />
          <p className="text-sm">this chapter is locked</p>
        </div>
      )}

      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={() => {}}
          autoPlay
          playbackId= {playbackId!}
        />
      )}


    </div>
  );
};

export default VideoPlayer;

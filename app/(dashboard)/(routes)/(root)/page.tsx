import CoursesList from "@/components/shared/CoursesList";
import { Button } from "@/components/ui/button";
import { getDashboardCourses } from "@/lib/actions/course.actions";
import { auth } from "@clerk/nextjs/server";
import { Check, CheckCircle, ClockIcon } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import InfoCard from "./_components/InfoCard";

export default async function Dashboard() {
  const {userId} = auth()
  if (!userId ) return redirect("/sign-in");

  const {completedCourses , coursesInProgress} = await getDashboardCourses(userId)
  return (
    <div className="p-6 space-y-4" >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard 
              numberOfItems = {coursesInProgress.length}
              label = "In Progress"
              icon = {ClockIcon}
           />
            <InfoCard 
              numberOfItems = {completedCourses.length}
              label = "Completed"
              icon = {CheckCircle}
              variant="success"
           />
      </div>
      <CoursesList items={[ ...coursesInProgress,...completedCourses ,]} />
    </div>
  );
}

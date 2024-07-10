import NavbarRoutes from '@/components/shared/NavbarRoutes';
import { Chapter, Course, UserProgress } from '@prisma/client';
import React from 'react'
import CourseMobileSidebar from './CourseMobileSidebar';

type  CourseNavbarProps =  {
    course: Course & {
      chapters: (Chapter & {
        userProgress: UserProgress[] | null;
      })[];
    };
    progressCount: number;
  };
  

const CourseNavbar = ( {course , progressCount} : CourseNavbarProps) => {
  return (
    <div className = "p-4 bg-white shadow-sm flex items-center border-b ">

                <CourseMobileSidebar 
                    course = {course}
                    progressCount = {progressCount}
                
                />


        <NavbarRoutes />
    </div>
  )
}

export default CourseNavbar
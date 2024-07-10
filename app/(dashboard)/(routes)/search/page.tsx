import { db } from "@/lib/db";
import Categories from "./_components/Categories";
import SearchInput from "@/components/shared/SearchInput";
import { getCourses } from "@/lib/actions/course.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CoursesList from "@/components/shared/CoursesList";

const SearchPage = async ({
  searchParams: { title, categoryId },
}: {
  searchParams: { title: string; categoryId: string };
}) => {
  const { userId } = auth();

  if (!userId) return redirect("/");
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const courses = await getCourses({ categoryId, title, userId });


  return (
    <>
      <div className="md:hidden px-6 block pt-6 md:mb-0 ">
        <SearchInput />
      </div>

      <div className="p-6 space-y-6">
        <Categories items={categories} />
        
        <CoursesList 
          //@ts-ignore
        items = {courses}/>
      </div>
    </>
  );
};

export default SearchPage;

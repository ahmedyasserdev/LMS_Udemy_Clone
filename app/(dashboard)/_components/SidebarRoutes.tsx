'use client'

import { studentRoutes, teacherRoutes } from "@/constants"
import SidebarItem from "./SidebarItem";
import { usePathname } from "next/navigation";

const SidebarRoutes = () => {
    const pathname = usePathname();
    const isTeacherPage = pathname?.includes('/teacher')
    const routes = isTeacherPage ? teacherRoutes : studentRoutes;
  return (
    <div className="flex flex-col w-full">

        {
            routes.map((route) => (
                <SidebarItem 
                    key = {route.href}
                    icon = {route.icon}
                    label = {route.label}
                href = {route.href}
                />
            ))
        }


    </div>
  )
}

export default SidebarRoutes
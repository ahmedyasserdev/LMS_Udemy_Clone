'use client'

import { studentRoutes } from "@/constants"
import SidebarItem from "./SidebarItem";

const SidebarRoutes = () => {
    const routes = studentRoutes;
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
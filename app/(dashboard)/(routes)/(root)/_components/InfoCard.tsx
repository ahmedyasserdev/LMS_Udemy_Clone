import React from 'react'
import { LucideIcon } from 'lucide-react';
import { IconBadge } from '@/components/shared/IconBadge';

type InfoCardProps = {
  numberOfItems : number ;
  label : string ;
  icon : LucideIcon;
  variant  ?: 'default' | 'success'
}
const InfoCard = ({numberOfItems  , variant , label , icon : Icon} : InfoCardProps ) => {
  return (
    <div className = "border rounded-md flex items-center gap-x-2 p-3" >
      <IconBadge 
      icon={Icon}
      variant = {variant}
      />

    <div>
      <p className = "font-medium" >{label}</p>

        <p className = "text-sm text-gray-500" >

        {numberOfItems} {numberOfItems  ===1 ? "Course" : "Courses"}

        </p>
    </div>

    </div>
  )
}

export default InfoCard
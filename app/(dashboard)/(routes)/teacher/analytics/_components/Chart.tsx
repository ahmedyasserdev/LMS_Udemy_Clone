'use client'

import { Card } from "@/components/ui/card";

import  {Bar  , ResponsiveContainer  , BarChart , XAxis , YAxis} from "recharts"
type ChartProps = {
  data : {
    name  : string ;
    total : number;
  }[]
}

const Chart = ({data} : ChartProps) => {
  return (
    <Card>
        <ResponsiveContainer width={"100%"} height={350} > 

          <BarChart  data={data} >
            <XAxis  dataKey="name"  fontSize={12} stroke="#888888" tickLine= {false} axisLine = {false} />
            <YAxis 
            
            fontSize={12} stroke="#888888" tickLine= {false} axisLine = {false} 
            tickFormatter={(value) => `$${value}`}
            
            />

            <Bar 
              dataKey = "total"
              fill = "#0369a1"
              radius = {[4,4,0,0]}
            />
         
          </BarChart>

        </ResponsiveContainer>


    </Card>
  )
}

export default Chart
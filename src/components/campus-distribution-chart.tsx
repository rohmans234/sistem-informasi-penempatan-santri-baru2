"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart"
import { useAppContext } from "@/context/app-context"

const chartConfig = {
  filled: {
    label: "Terisi",
    color: "hsl(var(--primary))",
  },
  total: {
    label: "Kuota",
    color: "hsl(var(--muted))",
  }
} satisfies ChartConfig

export default function CampusDistributionChart() {
  const { kampusList } = useAppContext();

  const chartData = kampusList
    .filter(k => k.status_aktif)
    .map(k => ({
      campus: k.nama_kampus.replace('Gontor ', 'G').replace('Pusat', 'P').replace('Putri', 'Pi'),
      filled: k.kuota_terisi,
      total: k.kuota_pelajar_baru,
    }));


  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="campus"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
          />
          <YAxis />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="total" fill="var(--color-total)" radius={4} />
          <Bar dataKey="filled" fill="var(--color-filled)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

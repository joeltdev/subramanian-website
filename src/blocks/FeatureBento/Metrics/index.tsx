'use client'
import React from 'react'
import { Area, AreaChart, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { FeatureBentoBlock } from '@/payload-types'
import { iconMap } from '@/blocks/shared/featureIcons'
import RichText from '@/components/RichText'
import DottedMap from 'dotted-map'

const map = new DottedMap({ height: 55, grid: 'diagonal' })
const points = map.getPoints()

const Map = () => (
  <svg viewBox="0 0 120 60" style={{ background: 'var(--color-background)' }}>
    {points.map((point, index) => (
      <circle key={index} cx={point.x} cy={point.y} r={0.15} fill="currentColor" />
    ))}
  </svg>
)

const chartConfig = {
  desktop: { label: 'Desktop', color: '#2563eb' },
  mobile: { label: 'Mobile', color: '#60a5fa' },
}

const chartData = [
  { month: 'May', desktop: 56, mobile: 224 },
  { month: 'June', desktop: 56, mobile: 224 },
  { month: 'January', desktop: 126, mobile: 252 },
  { month: 'February', desktop: 205, mobile: 410 },
  { month: 'March', desktop: 200, mobile: 126 },
  { month: 'April', desktop: 400, mobile: 800 },
]

const MonitoringChart = () => (
  <ChartContainer className="h-120 aspect-auto md:h-96" config={chartConfig}>
    <AreaChart accessibilityLayer data={chartData} margin={{ left: 0, right: 0 }}>
      <defs>
        <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
          <stop offset="55%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
          <stop offset="55%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <CartesianGrid vertical={false} />
      <ChartTooltip
        active
        cursor={false}
        content={<ChartTooltipContent className="dark:bg-muted" />}
      />
      <Area
        strokeWidth={2}
        dataKey="mobile"
        type="stepBefore"
        fill="url(#fillMobile)"
        fillOpacity={0.1}
        stroke="var(--color-mobile)"
        stackId="a"
      />
      <Area
        strokeWidth={2}
        dataKey="desktop"
        type="stepBefore"
        fill="url(#fillDesktop)"
        fillOpacity={0.1}
        stroke="var(--color-desktop)"
        stackId="a"
      />
    </AreaChart>
  </ChartContainer>
)

export const MetricsFeatureBento: React.FC<FeatureBentoBlock> = ({ stat, panelItems }) => {
  const items = panelItems ?? []
  const panel0 = items[0]
  const panel1 = items[1]
  const panel2 = items[2]

  const Icon0 = panel0?.icon ? iconMap[panel0.icon] : null
  const Icon1 = panel1?.icon ? iconMap[panel1.icon] : null
  const Icon2 = panel2?.icon ? iconMap[panel2.icon] : null

  return (
    <section className="px-6 py-16 md:py-32">
      <div className="mx-auto grid max-w-5xl border md:grid-cols-2">
        {/* Panel 0 – map decoration */}
        <div>
          <div className="p-6 sm:p-12">
            {panel0 && (
              <span className="text-muted-foreground flex items-center gap-2">
                {Icon0 && <Icon0 className="size-4" />}
                {panel0.label}
              </span>
            )}
            {panel0?.heading && (
              <RichText data={panel0.heading} enableGutter={false} />
            )}
          </div>
          <div aria-hidden className="relative">
            <div className="absolute inset-0 z-10 m-auto size-fit">
              <div className="rounded-(--radius) bg-background z-1 dark:bg-muted relative flex size-fit w-fit items-center gap-2 border px-3 py-1 text-xs font-medium shadow-md shadow-zinc-950/5">
                <span className="text-lg">🇨🇩</span> Last connection from DR Congo
              </div>
              <div className="rounded-(--radius) bg-background absolute inset-2 -bottom-2 mx-auto border px-3 py-4 text-xs font-medium shadow-md shadow-zinc-950/5 dark:bg-zinc-900" />
            </div>
            <div className="relative overflow-hidden">
              <div className="bg-radial z-1 to-background absolute inset-0 from-transparent to-75%" />
              <Map />
            </div>
          </div>
        </div>

        {/* Panel 1 – chat decoration */}
        <div className="overflow-hidden border-t bg-zinc-50 p-6 sm:p-12 md:border-0 md:border-l dark:bg-transparent">
          <div className="relative z-10">
            {panel1 && (
              <span className="text-muted-foreground flex items-center gap-2">
                {Icon1 && <Icon1 className="size-4" />}
                {panel1.label}
              </span>
            )}
            {panel1?.heading && (
              <RichText data={panel1.heading} enableGutter={false} />
            )}
          </div>
          <div aria-hidden className="flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-5 rounded-full border bg-muted items-center justify-center text-[8px] font-bold">AI</span>
                <span className="text-muted-foreground text-xs">Sat 22 Feb</span>
              </div>
              <div className="rounded-(--radius) bg-background mt-1.5 w-3/5 border p-3 text-xs">
                Hey, I&apos;m having trouble with my account.
              </div>
            </div>
            <div>
              <div className="rounded-(--radius) mb-1 ml-auto w-3/5 bg-blue-600 p-3 text-xs text-white">
                Molestiae numquam debitis et ullam distinctio provident nobis repudiandae.
              </div>
              <span className="text-muted-foreground block text-right text-xs">Now</span>
            </div>
          </div>
        </div>

        {/* Stat banner */}
        <div className="col-span-full border-y p-12">
          <p className="text-center text-4xl font-semibold lg:text-7xl">{stat ?? '99.99% Uptime'}</p>
        </div>

        {/* Panel 2 – chart decoration */}
        <div className="relative col-span-full">
          <div className="absolute z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12">
            {panel2 && (
              <span className="text-muted-foreground flex items-center gap-2">
                {Icon2 && <Icon2 className="size-4" />}
                {panel2.label}
              </span>
            )}
            {panel2?.heading && (
              <RichText data={panel2.heading} enableGutter={false} />
            )}
          </div>
          <MonitoringChart />
        </div>
      </div>
    </section>
  )
}

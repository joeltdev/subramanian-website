import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Globe } from 'lucide-react'
import type { FeatureBentoBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const PanelsFeatureBento: React.FC<FeatureBentoBlock> = ({ imagePanels }) => {
  const panels = imagePanels ?? []
  const p0 = panels[0]
  const p1 = panels[1]
  const p2 = panels[2]
  const p3 = panels[3]

  return (
    <section className="bg-muted py-16 md:py-32 dark:bg-muted/25">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto grid gap-2 sm:grid-cols-5">

          {/* Card 1 – large image panel (col-span-3) */}
          <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl">
            <CardHeader>
              <div className="md:p-6">
                {p0?.richText && <RichText data={p0.richText} enableGutter={false} />}
              </div>
            </CardHeader>
            {(p0?.imageDark || p0?.imageLight) && (
              <div className="mask-b-from-75% mask-b-to-95% relative h-fit pl-6 md:pl-12">
                <div className="bg-background overflow-hidden rounded-tl-lg border-l border-t pl-2 pt-2 dark:bg-zinc-950">
                  {typeof p0?.imageDark === 'object' && p0.imageDark && (
                    <Media
                      resource={p0.imageDark}
                      className="hidden dark:block"
                      imgClassName="w-full h-full object-cover"
                    />
                  )}
                  {typeof p0?.imageLight === 'object' && p0.imageLight && (
                    <Media
                      resource={p0.imageLight}
                      className="shadow dark:hidden"
                      imgClassName="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Card 2 – title + small image panel (col-span-2) */}
          <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl">
            {p1?.richText && (
              <div className="mx-auto my-6 max-w-md text-balance px-6 text-center md:p-6">
                <RichText data={p1.richText} enableGutter={false} />
              </div>
            )}
            {(p1?.imageDark || p1?.imageLight) && (
              <CardContent className="mt-auto h-fit">
                <div className="mask-radial-at-right mask-radial-from-75% mask-radial-[75%_75%] relative max-sm:mb-6">
                  <div className="aspect-76/59 overflow-hidden rounded-r-lg border">
                    {typeof p1?.imageDark === 'object' && p1.imageDark && (
                      <Media
                        resource={p1.imageDark}
                        className="hidden dark:block"
                        imgClassName="w-full h-full object-cover"
                      />
                    )}
                    {typeof p1?.imageLight === 'object' && p1.imageLight && (
                      <Media
                        resource={p1.imageLight}
                        className="shadow dark:hidden"
                        imgClassName="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Card 3 – title + keyboard shortcut decoration (col-span-2) */}
          <Card className="group p-6 shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-12">
            {p2?.richText && (
              <div className="mx-auto mb-12 max-w-md text-balance text-center">
                <RichText data={p2.richText} enableGutter={false} />
              </div>
            )}
            <div aria-hidden className="flex justify-center gap-6">
              <div className="inset-shadow-sm dark:inset-shadow-white/5 bg-muted/35 relative flex aspect-square size-16 items-center rounded-[7px] border p-3 shadow-lg ring dark:shadow-white/5 dark:ring-black">
                <span className="absolute right-2 top-1 block text-sm">fn</span>
                <Globe className="mt-auto size-4" />
              </div>
              <div className="inset-shadow-sm dark:inset-shadow-white/5 bg-muted/35 flex aspect-square size-16 items-center justify-center rounded-[7px] border p-3 shadow-lg ring dark:shadow-white/5 dark:ring-black">
                <span>K</span>
              </div>
            </div>
          </Card>

          {/* Card 4 – title + integration icons (col-span-3) */}
          <Card className="group relative shadow-zinc-950/5 sm:col-span-3 sm:rounded-none sm:rounded-br-xl">
            <CardHeader className="p-6 md:p-12">
              {p3?.richText && <RichText data={p3.richText} enableGutter={false} />}
            </CardHeader>
            <CardContent className="relative h-fit px-6 pb-6 md:px-12 md:pb-12">
              <div aria-hidden className="grid grid-cols-4 gap-2 md:grid-cols-6">
                <div className="rounded-(--radius) aspect-square border border-dashed" />
                <div className="rounded-(--radius) bg-muted/50 flex aspect-square items-center justify-center border p-4">
                  <img
                    className="m-auto size-8 invert dark:invert-0"
                    src="https://oxymor-ns.tailus.io/logos/linear.svg"
                    alt="Linear logo"
                    width="32"
                    height="32"
                  />
                </div>
                <div className="rounded-(--radius) aspect-square border border-dashed" />
                <div className="rounded-(--radius) bg-muted/50 flex aspect-square items-center justify-center border p-4">
                  <img
                    className="m-auto size-8 invert dark:invert-0"
                    src="https://oxymor-ns.tailus.io/logos/netlify.svg"
                    alt="Netlify logo"
                    width="32"
                    height="32"
                  />
                </div>
                <div className="rounded-(--radius) aspect-square border border-dashed" />
                <div className="rounded-(--radius) bg-muted/50 flex aspect-square items-center justify-center border p-4">
                  <img
                    className="m-auto size-8 invert dark:invert-0"
                    src="https://oxymor-ns.tailus.io/logos/github.svg"
                    alt="GitHub logo"
                    width="32"
                    height="32"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}

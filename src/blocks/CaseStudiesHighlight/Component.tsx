'use client'
import React, { useEffect, useState } from 'react'

import type { CaseStudiesHighlightBlock as CaseStudiesHighlightBlockType } from '@/payload-types'
import type { CaseStudy } from '@/payload-types'
import { Media } from '@/components/Media'
import Link from 'next/link'
import RichText from '@/components/RichText'

export const CaseStudiesHighlightBlock: React.FC<
  CaseStudiesHighlightBlockType & { disableInnerContainer?: boolean }
> = ({ intro, caseStudies: allCaseStudies }) => {
  const [xPercent, setXPercent] = useState(50)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setXPercent((e.clientX / window.innerWidth) * 100)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const [caseStudyRows] = useState<CaseStudy[][]>(() => {
    const populated = (allCaseStudies ?? []).filter(
      (cs): cs is CaseStudy => typeof cs === 'object' && cs !== null,
    )
    const filled: CaseStudy[] = [...populated]
    let i = 0
    while (filled.length < 6 && populated.length > 0) {
      filled.push(populated[i % populated.length])
      i++
    }
    const rows: CaseStudy[][] = []
    for (let n = 0; n < filled.length; n += 3) {
      rows.push(filled.slice(n, n + 3))
    }
    return rows
  })

  return (
    <section className="overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-16 md:pt-32">
        {intro && (
          <RichText
            data={intro}
            enableGutter={false}
            className="[&_h2]:type-headline-1 [&_h2]:text-type-heading [&_p]:type-body-xl [&_p]:text-type-secondary"
          />
        )}
      </div>

      <div className="pb-16 pt-8 md:pb-32">
        <div
          className="w-[150vw] -ml-[25vw]"
          style={{ transform: `translate3d(${(xPercent - 50) * -0.1}%, 0, 0)` }}
        >
          {caseStudyRows.map((row, i) => (
            <ul
              key={i}
              className={[
                'relative flex list-none m-0 p-0',
                i % 2 === 0 ? 'right-[20vh]' : 'left-[20vh]',
              ].join(' ')}
            >
              {row.map((caseStudy, j) => {
                const { slug, featuredImage, industry, title, useCase } = caseStudy
                return (
                  <li key={`${slug}-${j}`} className="w-1/3 p-4">
                    <Link
                      href={`/case-studies/${slug}`}
                      prefetch={false}
                      className="group relative block aspect-video overflow-hidden rounded-xl opacity-60 transition-all duration-300 ease-out hover:-translate-y-4 hover:opacity-100 hover:shadow-2xl"
                    >
                      {typeof featuredImage === 'object' && featuredImage && (
                        <Media
                          resource={featuredImage}
                          fill
                          imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                        <div className="space-y-2">
                          {(industry || useCase) && (
                            <div className="flex flex-wrap gap-x-2 text-white/70 type-label-md uppercase tracking-wider">
                              {industry && <span>{industry}</span>}
                              {industry && useCase && <span className="opacity-50">•</span>}
                              {useCase && <span>{useCase}</span>}
                            </div>
                          )}
                          <h3 className="text-white type-headline-3 font-semibold leading-tight">
                            {title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}

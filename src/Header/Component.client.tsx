'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header, Media } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="absolute md:sticky top-0 z-50 w-full md:bg-background bg-transparent border-none md:border-b md:border-white/10"
      data-section-theme="brand"
      style={{ '--header-height': '72px' } as React.CSSProperties}
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="py-4 flex items-center justify-end md:justify-between">
          <Link href="/" className="hidden md:block">
            {data.logo && typeof data.logo === 'object' && (data.logo as Media).url ? (
              <img
                src={(data.logo as Media).url!}
                alt={(data.logo as Media).alt ?? 'Logo'}
                width={(data.logo as Media).width ?? 193}
                height={(data.logo as Media).height ?? 34}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="max-h-8 md:max-h-10 w-auto transition-all brightness-0 invert"
              />
            ) : (
              <Logo
                loading="eager"
                priority="high"
                className="max-h-8 md:max-h-10 transition-all brightness-0 invert"
              />
            )}
          </Link>
          <DesktopNav data={data} />
          <MobileNav data={data} />
        </div>
      </div>
    </header>
  )
}

import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import localFont from 'next/font/local'
import React from 'react'

import { AdminBar } from '@/components/admin/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { ThemeInjector } from '@/ThemeSettings/ThemeInjector'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const generalSans = localFont({
  src: [
    {
      path: '../../../public/fonts/GeneralSans-Variable.woff2',
      style: 'normal',
      weight: '200 700',
    },
    {
      path: '../../../public/fonts/GeneralSans-VariableItalic.woff2',
      style: 'italic',
      weight: '200 700',
    },
  ],
  variable: '--font-general-sans',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(generalSans.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <ThemeInjector />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}

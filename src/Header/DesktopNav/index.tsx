'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

import type { Header } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

type Tab = NonNullable<Header['tabs']>[number]
type NavItem = NonNullable<Tab['navItems']>[number]

function NavItemContent({
  item,
  onLinkClick,
}: {
  item: NavItem
  onLinkClick?: () => void
}) {
  if (item.listLinks) {
    const { tag, links } = item.listLinks
    return (
      <div className="px-4 py-3">
        {tag && (
          <span className="type-label-md text-muted-foreground">
            {tag}
          </span>
        )}
        {links && links.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1.5">
            {links.map((item, i) => (
              <li key={i} className="translate-x-0 hover:translate-x-1.5 transition-transform duration-200">
                <CMSLink {...item.link} appearance="inline" onClick={onLinkClick} className="type-body-md font-medium text-foreground hover:text-primary transition-colors duration-200" />
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return null
}

export function DesktopNav({ data }: { data: Header }) {
  const tabs = data?.tabs ?? []
  const menuCta = data?.enableMenuCta ? data?.menuCta : null
  const [activeTab, setActiveTab] = useState<number | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setActiveTab(null), 200)
  }

  const activeTabData = activeTab !== null ? tabs[activeTab] : null

  return (
    <div className="hidden md:flex items-center gap-1">
      <nav className="flex items-center gap-1">
        {tabs.map((tab, i) => {
          const hasDropdown = tab.enableDropdown
          const isActive = activeTab === i

          // Plain link only (no dropdown)
          if (tab.enableDirectLink && tab.link && !hasDropdown) {
            return (
              <CMSLink
                key={i}
                {...tab.link}
                appearance="inline"
                className={cn(
                  'relative px-4 py-2.5 type-body-md font-medium transition-colors duration-200',
                  'text-foreground hover:text-brand-600 hover:bg-muted rounded-xl',
                )}
              />
            )
          }

          return (
            <div
              key={i}
              className="relative group"
              onMouseEnter={() => {
                if (hasDropdown) {
                  cancelClose()
                  setActiveTab(i)
                }
              }}
              onMouseLeave={() => {
                if (hasDropdown) scheduleClose()
              }}
            >
              <button
                className={cn(
                  'relative flex items-center gap-1.5 px-4 py-2.5 type-body-md font-medium transition-colors duration-200 hover:text-brand-600 hover:bg-muted rounded-md',
                  isActive ? 'text-primary hover:text-primary' : 'text-foreground hover:text-primary',
                )}
              >
                {tab.enableDirectLink && tab.link ? (
                  <CMSLink
                    {...tab.link}
                    appearance="inline"
                    className="text-inherit hover:text-inherit"
                  />
                ) : (
                  tab.label
                )}
                {hasDropdown && (
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 transition-transform duration-200',
                      isActive && 'rotate-180',
                    )}
                  />
                )}
                {/* Sliding underline */}
                <span
                  className={cn(
                    'absolute bottom-1.5 left-4 right-4 h-px bg-primary origin-left transition-transform duration-300',
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                  )}
                />
              </button>
            </div>
          )
        })}
      </nav>

      {menuCta?.url || menuCta?.reference ? (
        <CMSLink
          {...menuCta}
          appearance={menuCta.appearance ?? 'default'}
          className="ml-2"
        />
      ) : null}

      {/* Dropdown panel */}
      {activeTabData?.enableDropdown && activeTab !== null && (
        <div
          className="fixed left-0 right-0 top-[var(--header-height,64px)] z-50"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="w-full border-t bg-background shadow-md">
            <div className="mx-auto max-w-7xl px-8 py-8">
              <div className="gap-10 grid grid-cols-12">
                {/* Left: description + links */}
                {(activeTabData.description || (activeTabData.descriptionLinks?.length ?? 0) > 0) && (
                  <div className="col-span-4 shrink-0 pt-8 flex flex-col gap-4 border-r border-border pr-10">
                    {activeTabData.description && (
                      <p className="type-body-xl text-foreground">{activeTabData.description}</p>
                    )}
                    {activeTabData.descriptionLinks && activeTabData.descriptionLinks.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {activeTabData.descriptionLinks.map((dl, i) => (
                          <div key={i} className="translate-x-0 hover:translate-x-1.5 transition-transform duration-200">
                            <CMSLink
                              {...dl.link}
                              appearance="inline"
                              className="type-body-md text-muted-foreground hover:text-primary transition-colors duration-200"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Right: nav items grid */}
                {activeTabData.navItems && activeTabData.navItems.length > 0 && (
                  <div className="col-span-8 flex-1 grid grid-cols-2 gap-3 md:grid-cols-3">
                    {activeTabData.navItems.map((item, i) => (
                      <NavItemContent
                        key={i}
                        item={item}
                        onLinkClick={() => setActiveTab(null)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

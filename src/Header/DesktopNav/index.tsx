'use client'

import React, { useRef, useState } from 'react'
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
  const style = item.style ?? 'default'

  if (style === 'default' && item.defaultLink) {
    const { link, description } = item.defaultLink
    return (
      <div className="group flex flex-col gap-0.5 rounded-md px-3 py-2 hover:bg-accent transition-colors">
        <CMSLink {...link} appearance="inline" onClick={onLinkClick} className="font-medium text-sm" />
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    )
  }

  if (style === 'featured' && item.featuredLink) {
    const { tag, label, links } = item.featuredLink
    return (
      <div className="rounded-md bg-muted/50 px-3 py-3">
        {tag && (
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {tag}
          </span>
        )}
        {label && <p className="mt-1 font-semibold text-sm">{label}</p>}
        {links && links.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1">
            {links.map((item, i) => (
              <li key={i}>
                <CMSLink {...item.link} appearance="inline" onClick={onLinkClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors" />
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (style === 'list' && item.listLinks) {
    const { tag, links } = item.listLinks
    return (
      <div className="px-3 py-2">
        {tag && (
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {tag}
          </span>
        )}
        {links && links.length > 0 && (
          <ul className="mt-1 flex flex-col gap-1">
            {links.map((item, i) => (
              <li key={i}>
                <CMSLink {...item.link} appearance="inline" onClick={onLinkClick} className="text-sm hover:text-primary transition-colors" />
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

          if (tab.enableDirectLink && tab.link) {
            return (
              <CMSLink
                key={i}
                {...tab.link}
                appearance="inline"
                className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
              />
            )
          }

          return (
            <div
              key={i}
              className="relative"
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
                  'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary',
                  isActive && 'text-primary',
                )}
              >
                {tab.label}
                {hasDropdown && (
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 transition-transform duration-200',
                      isActive && 'rotate-180',
                    )}
                  />
                )}
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
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-xl border bg-background shadow-lg p-6 mt-1">
              {/* Header: description */}
              {(activeTabData.description || (activeTabData.descriptionLinks?.length ?? 0) > 0) && (
                <div className="mb-4 flex items-start justify-between gap-8 border-b pb-4">
                  <p className="max-w-sm text-sm text-muted-foreground">{activeTabData.description}</p>
                  {activeTabData.descriptionLinks && activeTabData.descriptionLinks.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {activeTabData.descriptionLinks.map((dl, i) => (
                        <CMSLink
                          key={i}
                          {...dl.link}
                          appearance="inline"
                          className="text-sm font-medium hover:text-primary transition-colors"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Nav items grid */}
              {activeTabData.navItems && activeTabData.navItems.length > 0 && (
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
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
      )}
    </div>
  )
}

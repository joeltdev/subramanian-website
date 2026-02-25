'use client'

import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react'

import type { Header } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

type Tab = NonNullable<Header['tabs']>[number]
type NavItem = NonNullable<Tab['navItems']>[number]

function MobileNavItem({
  item,
  onClose,
}: {
  item: NavItem
  onClose: () => void
}) {
  const style = item.style ?? 'default'

  if (style === 'default' && item.defaultLink) {
    const { link, description } = item.defaultLink
    return (
      <div className="flex flex-col gap-0.5 py-2">
        <CMSLink
          {...link}
          appearance="inline"
          onClick={onClose}
          className="font-medium text-sm"
        />
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    )
  }

  if (style === 'featured' && item.featuredLink) {
    const { tag, label, links } = item.featuredLink
    return (
      <div className="py-2">
        {tag && (
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {tag}
          </span>
        )}
        {label && <p className="font-semibold text-sm mt-0.5">{label}</p>}
        {links && links.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1.5">
            {links.map((item, i) => (
              <li key={i}>
                <CMSLink
                  {...item.link}
                  appearance="inline"
                  onClick={onClose}
                  className="text-sm text-muted-foreground"
                />
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
      <div className="py-2">
        {tag && (
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {tag}
          </span>
        )}
        {links && links.length > 0 && (
          <ul className="mt-1 flex flex-col gap-1.5">
            {links.map((item, i) => (
              <li key={i}>
                <CMSLink
                  {...item.link}
                  appearance="inline"
                  onClick={onClose}
                  className="text-sm"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return null
}

export function MobileNav({ data }: { data: Header }) {
  const tabs = data?.tabs ?? []
  const menuCta = data?.enableMenuCta ? data?.menuCta : null
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<number | null>(null)

  // Reset to level 1 when sheet closes
  useEffect(() => {
    if (!open) {
      setActiveTab(null)
    }
  }, [open])

  const activeTabData = activeTab !== null ? tabs[activeTab] : null

  return (
    <div className="flex md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            aria-label="Open navigation menu"
            className="p-2 rounded-md hover:bg-accent transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 flex flex-col p-0">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>

          {/* Level 1 — Tab list */}
          {activeTab === null ? (
            <div className="flex flex-col flex-1 overflow-y-auto">
              <nav className="flex flex-col px-4 pt-8 pb-4 gap-1 flex-1">
                {tabs.map((tab, i) => {
                  if (tab.enableDirectLink && tab.link) {
                    return (
                      <CMSLink
                        key={i}
                        {...tab.link}
                        appearance="inline"
                        onClick={() => setOpen(false)}
                        className="flex items-center px-3 py-3 text-base font-medium rounded-md hover:bg-accent transition-colors"
                      />
                    )
                  }

                  if (tab.enableDropdown) {
                    return (
                      <button
                        key={i}
                        className="flex items-center justify-between px-3 py-3 text-base font-medium rounded-md hover:bg-accent transition-colors w-full text-left"
                        onClick={() => setActiveTab(i)}
                      >
                        {tab.label}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )
                  }

                  return (
                    <span key={i} className="px-3 py-3 text-base font-medium">
                      {tab.label}
                    </span>
                  )
                })}
              </nav>

              {/* Footer CTA */}
              {(menuCta?.url || menuCta?.reference) && (
                <div className="p-4 border-t">
                  <CMSLink
                    {...menuCta}
                    appearance={menuCta.appearance ?? 'default'}
                    onClick={() => setOpen(false)}
                    className="w-full justify-center"
                  />
                </div>
              )}
            </div>
          ) : (
            /* Level 2 — Submenu */
            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="px-4 pt-8 pb-4">
                <button
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                  onClick={() => setActiveTab(null)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>

                {activeTabData && (
                  <>
                    <h2 className="text-lg font-semibold">{activeTabData.label}</h2>

                    {activeTabData.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {activeTabData.description}
                      </p>
                    )}

                    {activeTabData.descriptionLinks && activeTabData.descriptionLinks.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-3 border-b pb-4">
                        {activeTabData.descriptionLinks.map((dl, i) => (
                          <CMSLink
                            key={i}
                            {...dl.link}
                            appearance="inline"
                            onClick={() => setOpen(false)}
                            className="text-sm font-medium hover:text-primary transition-colors"
                          />
                        ))}
                      </div>
                    )}

                    {activeTabData.navItems && activeTabData.navItems.length > 0 && (
                      <div className="mt-4 flex flex-col divide-y">
                        {activeTabData.navItems.map((item, i) => (
                          <MobileNavItem
                            key={i}
                            item={item}
                            onClose={() => setOpen(false)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer CTA */}
              {(menuCta?.url || menuCta?.reference) && (
                <div className="mt-auto p-4 border-t">
                  <CMSLink
                    {...menuCta}
                    appearance={menuCta.appearance ?? 'default'}
                    onClick={() => setOpen(false)}
                    className="w-full justify-center"
                  />
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

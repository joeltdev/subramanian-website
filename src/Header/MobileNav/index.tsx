'use client'

import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Menu, ArrowRight } from 'lucide-react'

import type { Header } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
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
  if (!item.listLinks) return null

  const { tag, links } = item.listLinks
  return (
    <div className="py-2">
      {tag && (
        <span className="type-label-md text-muted-foreground">
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
                className="type-body-sm"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
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
            className="size-14 flex items-center justify-center bg-black text-white shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:bg-zinc-900 transition-all active:scale-95 group border border-white/10"
          >
            <Menu className="size-8 stroke-[1.5px] transition-transform group-hover:scale-110" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 flex flex-col p-0">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>

          {/* Level 1 — Tab list */}
          {activeTab === null ? (
            <div className="flex flex-col flex-1 overflow-y-auto">
              <nav className="flex flex-col px-6 pt-8 pb-4 gap-4 flex-1">
                {tabs.map((tab, i) => {
                  // Plain link only (no dropdown)
                  if (tab.enableDirectLink && tab.link && !tab.enableDropdown) {
                    return (
                      <CMSLink
                        key={i}
                        {...tab.link}
                        appearance="inline"
                        onClick={() => setOpen(false)}
                        className="flex items-center px-3 py-3 type-body-md rounded-none hover:bg-accent transition-colors"
                      />
                    )
                  }

                  if (tab.enableDropdown) {
                    return (
                      <button
                        key={i}
                        className="flex items-center justify-between px-3 py-3 type-body-md rounded-none hover:bg-accent transition-colors w-full text-left"
                        onClick={() => setActiveTab(i)}
                      >
                        {tab.label}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )
                  }

                  return (
                    <span key={i} className="px-3 py-3 type-body-md">
                      {tab.label}
                    </span>
                  )
                })}
              </nav>

              {/* Footer CTA */}
              {(menuCta?.url || menuCta?.reference) && (
                <div className="p-4 border-t">
                  {(() => {
                    const isManifesto = menuCta.label?.toUpperCase().includes('MANIFESTO')
                    const isMalayalamText = menuCta.label && /[\u0D00-\u0D7F]/.test(menuCta.label)
                    const isSpecial = isManifesto || isMalayalamText

                    return (
                      <CMSLink
                        {...menuCta}
                        appearance="inline"
                        onClick={() => setOpen(false)}
                        className={cn(
                          'w-full justify-center transition-all duration-300 font-bold uppercase tracking-widest text-xs rounded-none py-4 h-auto shadow-md flex items-center justify-center gap-2',
                          isSpecial
                            ? 'bg-[#98b6e5] text-black hover:bg-[#98b6e5]/90'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90',
                          isMalayalamText && 'font-malayalam normal-case tracking-normal text-sm'
                        )}
                      >
                        {isSpecial && <ArrowRight className="size-4" />}
                      </CMSLink>
                    )
                  })()}
                </div>
              )}
            </div>
          ) : (
            /* Level 2 — Submenu */
            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="px-4 pt-8 pb-4">
                <button
                  className="flex items-center gap-1 type-body-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                  onClick={() => setActiveTab(null)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>

                {activeTabData && (
                  <>
                    <h2 className="type-title-lg">{activeTabData.label}</h2>

                    {activeTabData.description && (
                      <p className="mt-1 type-body-sm text-muted-foreground">
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
                            className="type-body-sm hover:text-primary transition-colors"
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
                  {(() => {
                    const isManifesto = menuCta.label?.toUpperCase().includes('MANIFESTO')
                    const isMalayalamText = menuCta.label && /[\u0D00-\u0D7F]/.test(menuCta.label)
                    const isSpecial = isManifesto || isMalayalamText

                    return (
                      <CMSLink
                        {...menuCta}
                        appearance="inline"
                        onClick={() => setOpen(false)}
                        className={cn(
                          'w-full justify-center transition-all duration-300 font-bold uppercase tracking-widest text-xs rounded-none py-4 h-auto shadow-md flex items-center justify-center gap-2',
                          isSpecial
                            ? 'bg-[#98b6e5] text-black hover:bg-[#98b6e5]/90'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90',
                          isMalayalamText && 'font-malayalam normal-case tracking-normal text-sm'
                        )}
                      >
                        {isSpecial && <ArrowRight className="size-4" />}
                      </CMSLink>
                    )
                  })()}
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

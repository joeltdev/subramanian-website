'use client'
import React, { useState } from 'react'
import RichText from '@/components/RichText'
import type { Product } from '@/payload-types'

interface ProductTabsProps {
  description: Product['description'] | null | undefined
  technicalParameters: Product['technicalParameters'] | null | undefined
  instructionManual?: string | null
  dataSheet?: string | null
  ecDeclaration?: Product['ecDeclaration']
  productVideo?: string | null
  threeDModel?: string | null
}

type TabKey = 'description' | 'technical' | 'downloads' | 'video'

export const ProductTabs: React.FC<ProductTabsProps> = ({
  description,
  technicalParameters,
  instructionManual,
  dataSheet,
  ecDeclaration,
  productVideo,
  threeDModel,
}) => {
  const hasDownloads =
    instructionManual ||
    dataSheet ||
    (ecDeclaration && ecDeclaration.length > 0) ||
    threeDModel

  const allTabs: { key: TabKey; label: string; show: boolean }[] = [
    { key: 'description' as TabKey, label: 'Description', show: !!description },
    { key: 'technical' as TabKey, label: 'Technical Parameters', show: !!technicalParameters },
    { key: 'downloads' as TabKey, label: 'Downloads', show: !!hasDownloads },
    { key: 'video' as TabKey, label: 'Video', show: !!productVideo },
  ]
  const tabs = allTabs.filter((t) => t.show)

  const [activeTab, setActiveTab] = useState<TabKey>(tabs[0]?.key ?? 'description')

  if (tabs.length === 0) return null

  return (
    <section className="py-12">
      <div className="container">
        {/* Tab bar */}
        <div className="border-b border-gray-200">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="pt-8">
          {activeTab === 'description' && description && (
            <div className="prose prose-gray max-w-4xl">
              <RichText data={description} enableGutter={false} />
            </div>
          )}

          {activeTab === 'technical' && technicalParameters && (
            <div className="prose prose-gray max-w-4xl">
              <RichText data={technicalParameters} enableGutter={false} />
            </div>
          )}

          {activeTab === 'downloads' && hasDownloads && (
            <ul className="max-w-lg space-y-3">
              {instructionManual && (
                <li>
                  <a
                    href={instructionManual}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Installation Manual
                  </a>
                </li>
              )}
              {dataSheet && (
                <li>
                  <a
                    href={dataSheet}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Data Sheet
                  </a>
                </li>
              )}
              {ecDeclaration?.map((item, index) => (
                <li key={item.id ?? index}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    EC Declaration{ecDeclaration.length > 1 ? ` ${index + 1}` : ''}
                  </a>
                </li>
              ))}
              {threeDModel && (
                <li>
                  <a
                    href={threeDModel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    3D Model
                  </a>
                </li>
              )}
            </ul>
          )}

          {activeTab === 'video' && productVideo && (
            <div className="max-w-2xl">
              <a
                href={productVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600"
              >
                Watch product video
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// src/components/Product/ProductInfoAccordion.tsx
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Product } from '@/payload-types'

interface ProductInfoAccordionProps {
  ean?: string | null
  productCode?: string | null
  instructionManual?: string | null
  dataSheet?: string | null
  ecDeclaration?: Product['ecDeclaration']
}

export const ProductInfoAccordion: React.FC<ProductInfoAccordionProps> = ({
  ean,
  productCode,
  instructionManual,
  dataSheet,
  ecDeclaration,
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="labeling" className="w-full">
      <AccordionItem value="labeling">
        <AccordionTrigger>Product Labeling</AccordionTrigger>
        <AccordionContent>
          {ean || productCode ? (
            <dl className="space-y-1 text-sm text-gray-700">
              {ean && (
                <div className="flex gap-2">
                  <dt className="font-medium">EAN:</dt>
                  <dd>{ean}</dd>
                </div>
              )}
              {productCode && (
                <div className="flex gap-2">
                  <dt className="font-medium">Code:</dt>
                  <dd className="font-mono">{productCode}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-gray-500">No labeling information available.</p>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="manual">
        <AccordionTrigger>Installation Manual</AccordionTrigger>
        <AccordionContent>
          {instructionManual ? (
            <a
              href={instructionManual}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Download manual →
            </a>
          ) : (
            <p className="text-sm text-gray-500">Not available.</p>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="datasheet">
        <AccordionTrigger>Data Sheet</AccordionTrigger>
        <AccordionContent>
          {dataSheet ? (
            <a
              href={dataSheet}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Download data sheet →
            </a>
          ) : (
            <p className="text-sm text-gray-500">Not available.</p>
          )}
        </AccordionContent>
      </AccordionItem>

      {ecDeclaration && ecDeclaration.length > 0 && (
        <AccordionItem value="ec">
          <AccordionTrigger>EC Declaration</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1">
              {ecDeclaration.map((item, index) => (
                <li key={item.id ?? index}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    EC Declaration{ecDeclaration.length > 1 ? ` ${index + 1}` : ''} →
                  </a>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  )
}

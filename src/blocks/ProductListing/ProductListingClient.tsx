'use client'
import React, { useCallback, useState, useTransition } from 'react'
import type { Product } from '@/payload-types'
import { ProductCard } from '@/components/Product/ProductCard'

interface ProductListingClientProps {
  initialProducts: Product[]
  totalPages: number
  currentPage: number
  productsPerPage: number
  categoryId: number | null
  showPagination: boolean
  title?: string | null
  description?: string | null
}

export const ProductListingClient: React.FC<ProductListingClientProps> = ({
  initialProducts,
  totalPages,
  currentPage,
  productsPerPage,
  categoryId,
  showPagination,
  title,
  description,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [localTotal, setLocalTotal] = useState(totalPages)
  const [localPage, setLocalPage] = useState(currentPage)
  const [isPending, startTransition] = useTransition()

  const goToPage = useCallback(
    async (page: number) => {
      if (page === localPage) return
      startTransition(async () => {
        const params = new URLSearchParams({
          limit: String(productsPerPage),
          page: String(page),
          depth: '1',
        })
        if (categoryId) params.set('where[category][equals]', String(categoryId))

        const res = await fetch(`/api/products?${params}`)
        if (!res.ok) return
        const data = await res.json()
        setProducts(data.docs ?? [])
        setLocalTotal(data.totalPages ?? 1)
        setLocalPage(page)
      })
    },
    [localPage, productsPerPage, categoryId],
  )

  return (
    <div className="py-12">
      {(title || description) && (
        <div className="container mb-8 text-center">
          {title && <h2 className="text-3xl font-bold text-gray-900">{title}</h2>}
          {description && <p className="mt-2 text-gray-600">{description}</p>}
        </div>
      )}

      <div className="container">
        {isPending && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: productsPerPage }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-gray-100 aspect-[3/4]" />
            ))}
          </div>
        )}

        {!isPending && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isPending && products.length === 0 && (
          <div className="py-16 text-center text-gray-500">No products found.</div>
        )}

        {showPagination && localTotal > 1 && !isPending && (
          <nav className="mt-10 flex justify-center gap-2">
            <button
              disabled={localPage === 1}
              onClick={() => goToPage(localPage - 1)}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: localTotal }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`rounded px-3 py-1.5 text-sm ${
                  p === localPage
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={localPage === localTotal}
              onClick={() => goToPage(localPage + 1)}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}

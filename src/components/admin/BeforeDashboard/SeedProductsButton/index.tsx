'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import '../SeedButton/index.scss'

const SuccessMessage: React.FC = () => (
  <div>
    Products seeded! You can now{' '}
    <a target="_blank" href="/admin/collections/products">
      view your products
    </a>
  </div>
)

export const SeedProductsButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (loading) {
        toast.info('Seeding already in progress.')
        return
      }

      setLoading(true)

      try {
        toast.promise(
          new Promise((resolve, reject) => {
            try {
              fetch('/next/seed-products', { method: 'POST', credentials: 'include' })
                .then((res) => {
                  if (res.ok) {
                    resolve(true)
                    setSeeded(true)
                    setLoading(false)
                  } else {
                    reject('An error occurred while seeding products.')
                    setLoading(false)
                  }
                })
                .catch((error) => {
                  reject(error)
                  setLoading(false)
                })
            } catch (error) {
              reject(error)
              setLoading(false)
            }
          }),
          {
            loading: 'Seeding products....',
            success: <SuccessMessage />,
            error: 'An error occurred while seeding products.',
          },
        )
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        setError(error)
        setLoading(false)
      }
    },
    [loading],
  )

  let message = ''
  if (loading) message = ' (seeding...)'
  if (seeded) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick} disabled={loading}>
        Seed products
      </button>
      {message}
    </Fragment>
  )
}

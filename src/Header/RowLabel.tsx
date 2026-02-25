'use client'
import { Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Header['tabs']>[number]>()

  const label = data?.data?.label
    ? `Tab ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.label}`
    : 'Row'

  return <div>{label}</div>
}

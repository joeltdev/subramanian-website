import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'കെ.സി. സുബ്രഹ്മണ്യൻ്റെ ഔദ്യോഗിക വെബ്സൈറ്റ്.',
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: 'കെ.സി. സുബ്രഹ്മണ്യൻ',
  title: 'കെ.സി. സുബ്രഹ്മണ്യൻ | ഔദ്യോഗിക വെബ്സൈറ്റ്',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}

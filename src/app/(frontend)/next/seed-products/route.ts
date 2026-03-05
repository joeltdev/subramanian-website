import { createLocalReq, getPayload } from 'payload'
import { seed } from '@/scripts/seed-products'
import config from '@payload-config'
import { headers } from 'next/headers'

export const maxDuration = 300 // Product seeding can take a while due to image downloads

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  // Authenticate by passing request headers
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    // Create a Payload request object to pass to the Local API for transactions
    // At this point you should pass in a user, locale, and any other context you need for the Local API
    const payloadReq = await createLocalReq({ user }, payload)

    // We don't want to wipe existing data
    await seed({ payload, wipe: false })

    return Response.json({ success: true })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error seeding products' })
    return new Response('Error seeding products.', { status: 500 })
  }
}

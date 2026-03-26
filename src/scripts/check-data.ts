import { getPayload } from 'payload'
import config from '../payload.config'

async function check() {
  try {
    const payload = await getPayload({ config })
    const pages = await payload.find({ collection: 'pages' })
    const media = await payload.find({ collection: 'media' })
    console.log('Pages Count:', pages.totalDocs)
    console.log('Media Count:', media.totalDocs)
  } catch (e) {
    console.error('Error during check:', e)
  }
  process.exit(0)
}

check()

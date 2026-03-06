import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { showcasePageData } from './showcase'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
  'case-studies',
]

const globals: GlobalSlug[] = ['header', 'footer']

const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: { tabs: [] },
      depth: 0,
      context: { disableRevalidate: true },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: { columns: [] },
      depth: 0,
      context: { disableRevalidate: true },
    }),
  ])

  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
  }

  for (const collection of collections) {
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, image3Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post3.webp',
    ),
  ])

  // Showcase images
  const [
    heroImgBuffer,
    smartHomeBuffer,
    buildingBuffer,
    officeBuffer,
    hotelBuffer,
    datacenterBuffer,
    productBuffer,
    residentialBuffer,
    healthcareBuffer,
    industrialBuffer,
    retailBuffer,
    logoBuffer,
  ] = await Promise.all([
    fetchFileByURL('https://picsum.photos/seed/inels-hero/1400/900'),
    fetchFileByURL('https://picsum.photos/seed/smart-home/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/building-exterior/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/office-interior/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/hotel-lobby/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/data-center/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/hardware-product/800/600'),
    fetchFileByURL('https://picsum.photos/seed/apartment-exterior/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/hospital-corridor/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/industrial-warehouse/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/retail-interior/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/company-logo/200/80'),
  ])

  const [demoAuthor, image1Doc, image2Doc, image3Doc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  ])

  payload.logger.info(`— Seeding showcase media...`)

  const [
    heroImgDoc,
    smartHomeDoc,
    buildingDoc,
    officeDoc,
    hotelDoc,
    datacenterDoc,
    productDoc,
    residentialDoc,
    healthcareDoc,
    industrialDoc,
    retailDoc,
    logoDoc,
  ] = await Promise.all([
    payload.create({ collection: 'media', data: { alt: 'iNELS smart building hero' }, file: heroImgBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Smart home interior' }, file: smartHomeBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Building exterior' }, file: buildingBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Office interior' }, file: officeBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Hotel lobby' }, file: hotelBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Data center' }, file: datacenterBuffer }),
    payload.create({ collection: 'media', data: { alt: 'iNELS hardware product' }, file: productBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Apartment exterior' }, file: residentialBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Hospital corridor' }, file: healthcareBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Industrial warehouse' }, file: industrialBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Retail interior' }, file: retailBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Company logo placeholder' }, file: logoBuffer }),
  ])

  payload.logger.info(`— Seeding extended media...`)

  const [
    solutionsHeroBuffer,
    lightingBuffer,
    shadingBuffer,
    climateBuffer,
    energyBuffer,
    remoteBuffer,
    integrationBuffer,
    villaBuffer,
    residentialBuildingBuffer,
    commercialBuffer,
    grmsBuffer,
    hreskBuffer,
    smartCityBuffer,
    factoryBuffer,
    platformDiagramBuffer,
    teamBuffer,
    partnerBuffer,
    downloadBuffer,
  ] = await Promise.all([
    fetchFileByURL('https://picsum.photos/seed/solutions-hero/1400/900'),
    fetchFileByURL('https://picsum.photos/seed/lighting-control/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/shading-blinds/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/climate-hvac/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/energy-meter/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/remote-mobile/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/open-integration/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/villa-exterior/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/apartment-block/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/commercial-office/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/hotel-room/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/hotel-energy/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/smart-city-night/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/factory-floor/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/platform-diagram/1400/900'),
    fetchFileByURL('https://picsum.photos/seed/team-office/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/partner-handshake/1200/800'),
    fetchFileByURL('https://picsum.photos/seed/download-center/800/600'),
  ])

  const [
    solutionsHeroDoc,
    lightingDoc,
    shadingDoc,
    climateDoc,
    energyDoc,
    remoteDoc,
    integrationDoc,
    villaDoc,
    residentialBuildingDoc,
    commercialDoc,
    grmsDoc,
    hreskDoc,
    smartCityDoc,
    factoryDoc,
    platformDiagramDoc,
    teamDoc,
    partnerDoc,
    downloadDoc,
  ] = await Promise.all([
    payload.create({ collection: 'media', data: { alt: 'iNELS solutions overview' }, file: solutionsHeroBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Lighting control scene' }, file: lightingBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Automated shading blinds' }, file: shadingBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Climate HVAC control' }, file: climateBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Energy meter dashboard' }, file: energyBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Remote mobile control' }, file: remoteBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Open integration ecosystem' }, file: integrationBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Luxury villa exterior' }, file: villaBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Apartment residential building' }, file: residentialBuildingBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Commercial office building' }, file: commercialBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Hotel guest room' }, file: grmsBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Hotel energy management' }, file: hreskBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Smart city at night' }, file: smartCityBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Smart factory floor' }, file: factoryBuffer }),
    payload.create({ collection: 'media', data: { alt: 'iNELS platform architecture diagram' }, file: platformDiagramBuffer }),
    payload.create({ collection: 'media', data: { alt: 'iNELS team in office' }, file: teamBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Partner handshake' }, file: partnerBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Download center resources' }, file: downloadBuffer }),
  ])

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding case studies...`)

  const [caseStudy1, caseStudy2, caseStudy3] = await Promise.all([
    payload.create({
      collection: 'case-studies',
      data: {
        title: 'Grand Hotel Praha: 250-Room Smart Guest Automation',
        slug: 'grand-hotel-praha',
        industry: 'Hospitality',
        useCase: 'Guest room automation, HVAC, energy metering',
        featuredImage: hotelDoc.id,
        introContent: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'KNX-controlled guest rooms, centralised BMS, and 30% energy saving across all 250 rooms.', version: 1 },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
      context: { disableRevalidate: true },
    }),
    payload.create({
      collection: 'case-studies',
      data: {
        title: 'Penta Office Tower: HVAC Sub-Metering Across 12 Floors',
        slug: 'penta-office-tower',
        industry: 'Commercial Real Estate',
        useCase: 'BACnet/KNX HVAC, tenant sub-metering, ESG reporting',
        featuredImage: officeDoc.id,
        introContent: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Modbus energy meters integrated with KNX HVAC, delivering cloud dashboards for 40 tenants and full ESG reporting.', version: 1 },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
      context: { disableRevalidate: true },
    }),
    payload.create({
      collection: 'case-studies',
      data: {
        title: 'Novák Residences: 80-Apartment RF Smart Home Roll-out',
        slug: 'novak-residences',
        industry: 'Residential',
        useCase: 'RF smart home retrofit, app control, scene automation',
        featuredImage: residentialDoc.id,
        introContent: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'iNELS RF products installed across all 80 units, with 40% faster commissioning compared to the previous project.', version: 1 },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
      context: { disableRevalidate: true },
    }),
  ])

  payload.logger.info(`— Seeding pages...`)

  const [_, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: home({ metaImage: image2Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding showcase page...`)

  await payload.create({
    collection: 'pages',
    depth: 0,
    context: { disableRevalidate: true },
    data: showcasePageData(
      {
        heroImg: heroImgDoc.id,
        smartHome: smartHomeDoc.id,
        building: buildingDoc.id,
        office: officeDoc.id,
        hotel: hotelDoc.id,
        datacenter: datacenterDoc.id,
        product: productDoc.id,
        residential: residentialDoc.id,
        healthcare: healthcareDoc.id,
        industrial: industrialDoc.id,
        retail: retailDoc.id,
        logo: logoDoc.id,
      },
      [caseStudy1.id, caseStudy2.id, caseStudy3.id],
      contactForm.id,
    ),
  })

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        tabs: [
          {
            label: 'Posts',
            enableDirectLink: true,
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts',
            },
          },
          {
            label: 'Contact',
            enableDirectLink: true,
            link: {
              type: 'reference',
              label: 'Contact',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        columns: [],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()
  const ext = url.split('.').pop()?.toLowerCase()
  const knownExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']
  const mimetype =
    ext && knownExts.includes(ext)
      ? `image/${ext === 'jpg' ? 'jpeg' : ext}`
      : 'image/jpeg'

  // For picsum URLs like https://picsum.photos/seed/inels-hero/1400/900,
  // use the seed keyword as the filename to avoid collisions on the dimension segment.
  const picsumSeed = url.match(/picsum\.photos\/seed\/([^/]+)/)?.[1]
  const name = picsumSeed
    ? `${picsumSeed}.jpg`
    : url.split('/').pop() || `file-${Date.now()}`

  return {
    name,
    data: Buffer.from(data),
    mimetype,
    size: data.byteLength,
  }
}

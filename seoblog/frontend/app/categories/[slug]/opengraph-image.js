import { ImageResponse } from 'next/og'
import { getOneCategory } from '@/actions/category'
 
// Route segment config
export const runtime = 'edge'
const size = { width: 1200, height: 630 };

export async function generateImageMetadata({ params }) {
  const {category} = await getOneCategory(params.slug)
  return [{
    id: params.slug,
    size,
    alt: category.name,
    contentType: 'image/png',
  }]
}
 
// Image generation
export default async function Image({params}) {
  const {category} = await getOneCategory(params.slug)
  // Font
  const interSemiBold = fetch(
    new URL('./Inter-SemiBold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())
 
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {category.name}
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
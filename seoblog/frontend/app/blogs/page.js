import Blog from "@/components/Blog/Blog"
import { listBlogCatTag } from "@/actions/blog"
import { API, DOMAIN, APP_NAME } from "@/config";
import { findCurrentPath } from "@/helpers/findCurrentPath";

export const metadata = {
  title: `MERN Blog App Tutorial | ${APP_NAME}`,
  description: 'List of blogs',
  metadataBase: new URL(`${DOMAIN}/${findCurrentPath()}`),
  alternates: {
    canonical: '/'
  }, 
  openGraph:  {
    title: `Latest blogs | ${APP_NAME}`,
    description: 'Blogs generated as part of a MERN tutorial',
    url: `${DOMAIN}/${findCurrentPath()}`,
    siteName: APP_NAME,
    type:'website'
  }
}

export default async function Page() {
    return (
      <>
        <Blog initialProps={await listBlogCatTag()}/>
      </>
    )
  }
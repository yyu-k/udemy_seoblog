import Blogs from "@/components/Blog/Blog"
import { listBlogCatTag } from "@/actions/blog"
import { API, DOMAIN, APP_NAME } from "@/config";
import { findCurrentPath } from "@/helpers/findCurrentPath";
import { BLOG_LOAD_LIMIT } from "@/config";

export const metadata = {
  metadataBase: new URL(DOMAIN),
  title: `MERN Blog App Tutorial | ${APP_NAME}`,
  description: 'List of blogs',
  alternates: {
    canonical: '/'
  }, 
  openGraph:  {
    title: `Latest blogs | ${APP_NAME}`,
    description: 'Blogs generated as part of a MERN tutorial',
    url: `/${findCurrentPath()}`,
    siteName: APP_NAME,
    type:'website'
  }
}

export default async function Page() {
    return (
      <>
        <Blogs initialProps={await listBlogCatTag(0, BLOG_LOAD_LIMIT)}/>
      </>
    )
  }
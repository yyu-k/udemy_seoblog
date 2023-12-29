import { readSingleBlog } from "@/actions/blog"
import {SingleBlog} from "@/components/Blog/SingleBlog"
import { APP_NAME, DOMAIN, API } from "@/config"

export async function generateMetadata({ params,}, parent) {
  const blog = await readSingleBlog(params.slug);
  if (blog.error) {
    return 
  }

  const photoType = await fetch(`${API}/blog/photo/${blog.slug}`) //seeems a bit overkill to do this just to get the contenttype, but done as an exercise to mirror the tutorial despite changes in api
    .then((res) => {
      if (!res.ok) {
        return ''
      }
      return res.headers.get('content-type')
    })
    .catch((err) => {
      console.log(err.message)
      return ''
    })

  return {
    //metadataBase: new URL(`${DOMAIN}/blogs/${blog.slug}`),
    title: `${blog.title} | ${APP_NAME}`,
    metadataBase: new URL(DOMAIN),
    description: blog.metaDescription,
    alternates: {
      canonical: '/'
    },
    openGraph: {
      title:  `${blog.title} | ${APP_NAME}`,
      description: blog.metaDescription,
      url: `/blogs/${blog.slug}`,
      siteName: APP_NAME,
      images: [{
        url : `${API}/blog/photo/${blog.slug}`,
        secure_url: `${API}/blog/photo/${blog.slug}`,
        type: photoType
      }],
      type:'website'
    },
  }
}

export default async function Page({params}) {
    return (
      <SingleBlog blog={await readSingleBlog(params.slug)}/>
    )
  }
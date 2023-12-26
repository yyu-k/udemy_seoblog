import Blog from "@/components/Blog"
import { listBlogCatTag } from "@/actions/blog"

export default async function Page() {
    return (
      <>
       <Blog initialProps={await listBlogCatTag()}/>
      </>
    )
  }
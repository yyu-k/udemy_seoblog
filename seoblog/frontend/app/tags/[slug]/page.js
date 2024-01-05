import { getOneTag } from "@/actions/tag";
import Card from "@/components/Blog/Card";
import { APP_NAME, DOMAIN } from "@/config";

export async function generateMetadata({ params,}, parent) {
    const {tag} = await await getOneTag(params.slug);

    return {
      //metadataBase: new URL(`${DOMAIN}/blogs/${blog.slug}`),
      title: `${tag.name} | ${APP_NAME}`,
      metadataBase: new URL(DOMAIN),
      description: `List of blogs relating to ${tag.name}`,
      alternates: {
        canonical: `/tags/${params.slug}`
      },
      openGraph: {
        title:  `${tag.name} | ${APP_NAME}`,
        description: `List of blogs relating to ${tag.name}`,
        url: `/tags/${params.slug}`,
        siteName: APP_NAME,
        type:'website'
      },
    }
  }

export default async function Page({params}) {
    const oneTag = await getOneTag(params.slug);
    if (oneTag.error) {
        return (
            <div className="alert alert-danger" role='alert'>
                {oneTag.error}
            </div>
        )
    } 
    return (
      <>
        <main>
            <div className="container-fluid text-center">
                <header>
                    <div className="col-md-12 pt-3">
                        <h1 className="display-4 font-weight-bold">
                            {oneTag.tag.name}
                        </h1>
                        {oneTag.blogs.map((blog) => {
                            return (
                                <div key={blog._id} className="text-start">
                                    <Card blog={blog}/>
                                </div>
                            )
                        })}
                    </div>
                </header>
            </div>
        </main>
      </>
    )
}
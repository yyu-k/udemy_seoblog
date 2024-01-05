import { getOneCategory} from "@/actions/category"
import { APP_NAME, DOMAIN } from "@/config";
import Card from "@/components/Blog/Card";

export async function generateMetadata({ params,}, parent) {
    const {category} = await getOneCategory(params.slug);

    return {
      //metadataBase: new URL(`${DOMAIN}/blogs/${blog.slug}`),
      title: `${category.name} | ${APP_NAME}`,
      metadataBase: new URL(DOMAIN),
      description: `List of blogs relating to ${category.name}`,
      alternates: {
        canonical: `/categories/${params.slug}`
      },
      openGraph: {
        title:  `${category.name} | ${APP_NAME}`,
        description: `List of blogs relating to ${category.name}`,
        url: `/categories/${params.slug}`,
        siteName: APP_NAME,
        type:'website'
      },
    }
  }

export default async function Page({params}) {
    const oneCat = await getOneCategory(params.slug);
    if (oneCat.error) {
        return (
            <div className="alert alert-danger" role='alert'>
                {oneCat.error}
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
                            {oneCat.category.name}
                        </h1>
                        {oneCat.blogs.map((blog) => {
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
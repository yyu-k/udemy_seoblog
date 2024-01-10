import Link from "next/link"
import moment from "moment"
import { SimpleError } from "@/components/SimpleError"
import { userPublicProfile } from "@/actions/user"
import { DOMAIN, APP_NAME } from "@/config"

export async function generateMetadata({ params,}, parent) {
    return {
      metadataBase: new URL(DOMAIN),
      title: `${params.username} | ${APP_NAME}`,
      description: `Profile of ${params.username}`,
      alternates: {
        canonical: `/profile/${params.username}`
      },
      openGraph: {
        title:  `${params.username} | ${APP_NAME}`,
        description: `Profile of ${params.username}`,
        url: `/profile/${params.username}`,
        siteName: APP_NAME,
        images: [{
          url : `/Steamboat-willie.jpg`,
          type: 'image/jpg'
        }],
        type:'website'
      },
    }
  }

export default async function Page({params}) {
    //get data
    const data = await userPublicProfile(params.username)
    if (data.error) {
        return (
            <SimpleError error={data.error}/>
        )
    } 
    const {user, blogs} = data;

    const showUserBlogs = () => {
        return blogs.map(blog => {
            return (
                <div key={blog._id} className="mt-4 mb-4">
                    <p>
                        <Link href={`/blogs/${blog.slug}`} className="lead">
                            {blog.title}
                        </Link>
                    </p>
                </div>
            )
        })
    }



    return (
        <>
        <div className="container">
            <div className="row">
                <div className="col-md-12 mt-4 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5>{user.name}</h5>
                            <Link href={`${user.profile}`}>
                                View Profile
                            </Link>
                            <p className="text-muted">
                                Joined {moment(user.createdAt).fromNow()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <br/>
        <div className="container pb-5">
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title bg-primary pt-4 pb-4 ps-4 pe-4 text-white">
                                Recent blogs by {user.name}
                            </h5>
                            {showUserBlogs()}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title bg-primary pt-4 pb-4 ps-4 pe-4 text-white">
                                Message {user.name}
                            </h5>
                            <br/>
                            <p>
                                contact form
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
  }
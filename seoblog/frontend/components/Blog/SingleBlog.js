'use client'

import { API, DOMAIN, APP_NAME } from "@/config"
import '@/css/styles.css' //modifies the featured-image class
import moment from "moment"
import { showCategories, showTags, showRelatedBlogs } from "@/helpers/blog"
import { useState, useEffect } from "react"
import { listRelated } from "@/actions/blog"
import { useRouter } from "next/navigation"

export const SingleBlog = ({blog}) => {
    const router = useRouter();
    const [related, setRelated] = useState();
    const loadRelated = () => {
        listRelated({'blog' : blog})
        .then((data) => {
            if (data.error) {
                console.log(data.error)
            }
            setRelated(data);
        })
    }
    useEffect(() => {
        loadRelated();
        router.refresh();
    },[]);

    if (blog.error) {
        return (
            <>
            <div className="alert alert-warning" role='alert'>
                {blog.error}
            </div>
            </>
        )
    }
    return (
        <main>
            <article>
            <div className="container-fluid">
                <section>
                    <div className="row" style={{marginTop:'-10px'}}>
                        <img src={`${API}/blog/photo/${blog.slug}`}
                            alt={blog.title}
                            className="img img-fluid featured-image"
                        />
                    </div>
                </section>
                <section>
                    <div className="container">
                        <h1 className="display-2 pb-3 text-center font-weight-bold">{blog.title}</h1>
                        <p className="lead mt-3 mark">
                            Written by {blog.postedBy.name} | published {moment(blog.updatedAt).fromNow()}
                        </p>
                        <div className="pb-3">
                            {showCategories(blog)}
                            {showTags(blog)}
                            <br/>
                        </div>
                    </div>
                </section>
            </div>
            <div className="container">
                <section>
                    <div className="col-md-12 lead" 
                    dangerouslySetInnerHTML={{__html : blog.body}}/>
                </section>
            </div>
            <div className="container pb-5">
                <h4 className="text-center pt-5 pb-5 h2">
                    Related Blogs
                </h4>
                <hr/>
                <div className="row">
                    {showRelatedBlogs(related)}
                </div>
            </div>
            <div className="container pb-5">
                Show Comments
            </div>
            </article>
        </main>
    )
}
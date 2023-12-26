'use client'

import Head from "next/head";
import Link from "next/link";
import { listBlogCatTag } from "@/actions/blog";
import { API } from "@/config";
import { useState } from "react";
import moment from "moment";

//The blog component should be rendered on server initially using initial props for SEO purpose - crawlers cannot read purely client-side rendered content

const Blog = ({initialProps}) => {

    const showAllBlogs = () => {
        return (
            initialProps.blogs.map((blog, index) => {
                return(
                    <article key={index}>
                        <div className="lead pb-4">
                            <header>
                                <Link href={`/blogs/${blog.slug}`}>
                                    <h2 className="pt-3 pb-3 fw-bold">{blog.title}</h2>
                                </Link>
                            </header>
                            <section>
                                <p className="mark pt-2 pb-2 ms-1">
                                    Written by {blog.postedBy.name} | published {moment(blog.updatedAt).fromNow()}
                                </p>
                            </section>
                            <section>
                                <p>Blog categories and tags</p>
                            </section>
                            <div className='row'>
                                <div className="col-md-4">
                                    image
                                </div>
                                <div className="col-md-8">
                                    <section>
                                        <div className="pb-3" dangerouslySetInnerHTML={{__html : blog.excerpt}}/>
                                        <Link href={`blog/${blog.slug}`}>
                                            <li className="btn btn-primary pt-2">Read More</li>
                                        </Link>
                                    </section>
                                </div>
                            </div>
                        </div>
                        <hr/>
                    </article>
                )
            })
        )
    }

    if (initialProps.error) {
        return (
            <div className='alert alert-danger'>
                {initialProps.error}
            </div>
        )
    }
    return (
        <>
        <main>
            <div className="container-fluid">
                <header>
                    <div className="col-md-12 pt-3">
                        <h1 className="display-4 font-weight-bold text-center">
                            Insert Title Here
                        </h1>
                    </div>
                    <section>
                        <p>Show categories and tags</p>
                    </section>
                </header>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        {showAllBlogs()}
                    </div>
                </div>
            </div>
        </main>
        </>
    )
}

export default Blog
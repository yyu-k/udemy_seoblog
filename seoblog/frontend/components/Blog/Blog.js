'use client'

import Link from "next/link";
import { listBlogCatTag } from "@/actions/blog";
import { useState } from "react";
import Card from "./Card";

//The blog component should be rendered on server initially using initial props for SEO purpose - crawlers cannot read purely client-side rendered content

const Blog = ({initialProps}) => {
    const { blogs, categories, tags, size } = initialProps;

    const showAllCategories = () => {
        return categories.map((c, i) => {
            return (
                <Link className="btn btn-primary me-1 ms-1 mt-3" 
                    key={c._id} 
                    href={`/categories/${c.slug}`}>
                    {c.name}
                </Link>
            )
        })
    }

    const showAllTags = () => {
        return tags.map((t, i) => {
            return (
                <Link className="btn btn-outline-primary me-1 ms-1 mt-3"
                    key={t._id} 
                    href={`/categories/${t.slug}`}>
                    {t.name}
                </Link>
            )
        })
    }

    const showAllBlogs = () => {
        return (
            blogs.map((blog) => {
                return(
                    <Card key={blog._id} blog={blog}/>
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
                        <div className="pb-5 text-center">
                            {showAllCategories()}
                            <br />
                            {showAllTags()}
                        </div>
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
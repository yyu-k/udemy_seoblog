'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import Card from "./Card";
import { BLOG_LOAD_LIMIT } from "@/config";
import { listBlogCatTag } from "@/actions/blog";

//The blog component should be rendered on server initially using initial props for SEO purpose - crawlers cannot read purely client-side rendered content

const Blogs = ({initialProps}) => {
    const { blogs, categories, tags, size } = initialProps;
    const [limit, setLimit] = useState(BLOG_LOAD_LIMIT);
    const [skip, setSkip] = useState(0);
    const [numBlogs, setNumBlogs] = useState(size);
    const [loadedBlogs, setLoadedBlogs] = useState([...blogs]);

    const loadMore = () => {
        const toSkip = skip + limit;
        listBlogCatTag(toSkip, limit)
        .then((data) => {
            if(data.error) {
                console.log(data.error)
            } else {
                setLoadedBlogs([...loadedBlogs, ...data.blogs]);
                setNumBlogs(data.size);
                setSkip(toSkip);
            }
        })
    }

    const loadMoreButton = () => {
        if (numBlogs >= limit) {
            return (
                <button onClick={loadMore} className="btn btn-primary btn-lg">
                    Load More
                </button>
            );
        }
    }

    const showAllCategories = () => {
        return categories.map((c, i) => {
            return (
                <Link className="btn btn-outline-primary me-1 ms-1 mt-3" 
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
                <Link className="btn btn-primary me-1 ms-1 mt-3"
                    key={t._id} 
                    href={`/tags/${t.slug}`}>
                    {t.name}
                </Link>
            )
        })
    }

    const showAllBlogs = () => {
        return (
            loadedBlogs.map((blog) => {
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
                {showAllBlogs()}
            </div>
            <div className="container-fluid pt-5 pb-5">
                {loadMoreButton()}
            </div>
        </main>
        </>
    )
}

export default Blogs
'use client'
import { useState, useEffect } from "react"
import Link from "next/link"
import moment from "moment"
import { getCookie, getLocalStorageUser } from "@/actions/auth"
import { listBlogs, updateBlog, deleteBlog} from "@/actions/blog"


export const BlogRead = () => {
    const [blogs, setBlogs] = useState([]);
    const [msg, setMsg] = useState('');
    const token = getCookie('token');
    const loadBlogs = () => {
        listBlogs()
        .then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setBlogs(data);
            }
        })
    }

    const removeBlog = (slug) => {
        deleteBlog(slug, token)
        .then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                setMsg(data.message);
                loadBlogs();
            }
        })
    }

    const deleteConfirm = (slug, title) => {
        const answer = window.confirm(`Are you sure you want to delete the blog ${title}?`);
        if (answer) {
          removeBlog(slug);  
        }
    }

    const showMsg = () => {
        if (msg) {
            return (
                <div className="alert alert-warning">
                    {msg}
                </div>
            )
        } 
    }

    const showUpdateButton = (blog) => {
        const user = getLocalStorageUser();
        if (!user) {
            setMsg("Something has gone wrong - no user found. Please log in.");
            return;
        }
        if (user.role === 0) {
            return (
                <Link href={`/user/crud/${blog.slug}`} className="btn btn-sm btn-warning ms-2">
                    Update
                </Link>
            )
        } else if (user.role === 1) {
            return (
                <Link href={`/admin/crud/${blog.slug}`} className="btn btn-sm btn-warning ms-2">
                    Update
                </Link>
            )
        }
    }

    const showAllBlogs = () => {
        return (
            blogs.map((blog) => {
                return (
                    <div key={blog._id} className="pb-5">
                        <h3>{blog.title}</h3>
                        <p className="mark">
                            Written by {blog.postedBy.name} | Published on {moment(blog.updatedAt).fromNow()}
                        </p>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteConfirm(blog.slug, blog.title)}>
                            Delete
                        </button>
                        {showUpdateButton(blog)}
                    </div>
                );
            })
        )
    }

    useEffect(() => {
        loadBlogs();
    }, [blogs.length])

    

    return (
        <>
        <div className="row">
            <div className="col-md-12">
                {showMsg()}
                {showAllBlogs()}
            </div>
        </div>
        </>
    );
}
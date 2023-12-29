'use client'
import { useState, useEffect } from "react"
import Link from "next/link"
import { getCookie, getLocalStorageUser } from "@/actions/auth"
import { listBlogs, updateBlog } from "@/actions/blog"


export const BlogRead = () => {
    return (
        <>
            <p>Update/Delete Blogs</p>
        </>
    )
}
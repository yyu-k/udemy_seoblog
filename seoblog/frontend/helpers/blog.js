import Link from "next/link"

export const showCategories = (blog) => {
    return (
        blog.categories.map((c,i) => {
            return (
                <Link key={c._id} href={`/categories/${c.slug}`}>
                    <span className="btn btn-outline-primary me-1 ms-1 mt-3">
                        {c.name}
                    </span>
                </Link>
            )
        })
    )   
}

export const showTags = (blog) => {
    return (
        blog.tags.map((t,i) => {
            return (
                <Link key={t._id} href={`/categories/${t.slug}`}>
                    <span className="btn btn-primary me-1 ms-1 mt-3">
                        {t.name}
                    </span>
                </Link>
            )
        })
    )
}
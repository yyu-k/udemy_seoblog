import moment from "moment";
import Link from "next/link";
import { API } from "@/config";

const Card = ({blog}) => {
    const showCategories = (blog) => {
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
    const showTags = (blog) => {
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
    return (
        <article key={blog._id}>
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
                <section className="pb-3">
                    {showCategories(blog)}
                    {showTags(blog)}
                </section>
                <div className='row'>
                    <div className="col-md-4">
                        <section>
                            <img className="img img-fluid"
                            style={{maxHeight: '150px',
                                    width : 'auto'}}
                            src={`${API}/blog/photo/${blog.slug}`}
                            alt={blog.title}/>
                        </section>
                    </div>
                    <div className="col-md-8">
                        <section>
                            <div className="pb-3" dangerouslySetInnerHTML={{__html : blog.excerpt}}/>
                            <Link href={`blog/${blog.slug}`}>
                                <span className="btn btn-primary pt-2">Read More</span>
                            </Link>
                        </section>
                    </div>
                </div>
            </div>
            <hr/>
        </article>
    )
}

export default Card;
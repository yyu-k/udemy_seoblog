import moment from "moment";
import Link from "next/link";
import { API } from "@/config";
import { showTags, showCategories } from "@/helpers/blog";
import { ImageOrNone } from "../ImageOrNone";

const Card = ({blog}) => {
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
                    Written by <Link href={`/profile/${blog.postedBy.username}`}>{blog.postedBy.username}</Link> | published {moment(blog.updatedAt).fromNow()}
                    </p>
                </section>
                <section className="pb-3">
                    {showCategories(blog)}
                    {showTags(blog)}
                </section>
                <div className='row'>
                    <div className="col-md-4">
                        <section>
                            <ImageOrNone className="img img-fluid"
                            style={{maxHeight: 'auto',
                                    width : '100%'}}
                            src={`${API}/blog/photo/${blog.slug}`}
                            alt={blog.title}/>
                        </section>
                    </div>
                    <div className="col-md-8">
                        <section>
                            <div className="pb-3" dangerouslySetInnerHTML={{__html : blog.excerpt}}/>
                        </section>
                        <Link href={`/blogs/${blog.slug}`} className="btn btn-primary pt-2">
                                Read More
                        </Link>
                    </div>
                </div>
            </div>
            <hr/>
        </article>
    )
}

export default Card;
import moment from "moment";
import Link from "next/link";
import { API } from "@/config";
import { ImageOrNone } from "../ImageOrNone"

const SmallCard = ({blog}) => {
    return (
        <article key={blog._id}>
            <div className="card">
                <section>
                    <Link href={`/blogs/${blog.slug}`}>
                        <ImageOrNone className="img img-fluid"
                            style={{width : '100%'}}
                            src={`${API}/blog/photo/${blog.slug}`}
                            alt={blog.title}/>
                    </Link>
                </section>
                <div className="card-body">
                    <section>
                        <Link href={`/blogs/${blog.slug}`}>
                            <h5 className="card-title">
                                {blog.title}
                            </h5>
                        </Link>
                        <p className="card-text" dangerouslySetInnerHTML={{__html : blog.excerpt}}/>
                    </section>
                </div>
                <div className="card-body">
                    <div>
                        Posted {moment(blog.updatedAt).fromNow()} by <Link href='/'>{blog.postedBy.username}</Link>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default SmallCard;
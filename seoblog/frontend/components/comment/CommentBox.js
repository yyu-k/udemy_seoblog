import { CommentCreate } from "./CommentCreate"
import { CommentRead } from "./CommentRead"

export const CommentBox = ({slug}) => {       

    return (
        <>
            <div className="container text-muted">
                <CommentCreate slug={slug}/>
                <CommentRead slug={slug}/>
            </div>
        </>
    )
}


 

import { ImageOrNone } from "../ImageOrNone"
import moment from "moment"

export const CommentCard = ({comment}) => {
    const base64String = Buffer.from(comment.postedBy.photo.data.data).toString('base64')
    const imgString = `data:${comment.postedBy.photo.contentType};base64,${base64String}`
    return (
        <div className="card mb-3">
            <div className="row no-gutters">
                <div className="col-md-3">
                    <ImageOrNone src={imgString} className="img-thumbnail img-fluid" width="150" height="150"/>
                </div>
                <div className="col-md-9">
                    <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">{comment.postedBy.username}</h6>
                        <p className="card-text">{comment.text}</p>
                        <h6 className="card-subtitle mb-2 text-muted">
                            Posted at {moment(comment.createdAt).toDate().toDateString()}
                        </h6>
                    </div>
                </div>
            </div>
        </div>
    )    
}

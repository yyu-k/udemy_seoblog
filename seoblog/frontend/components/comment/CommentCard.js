export const CommentCard = ({comment}) => {
    return (
        <div className="card" key={comment._id}>
            <div className="row no-gutters">
                <div className="col-md-3">
                    <img src="/no_image.jpg" className="img-fluid"></img>
                </div>
                <div className="col-md-9">
                    <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">{comment.postedBy.username}</h6>
                        <p className="card-text">{comment.text}</p>
                    </div>
                </div>
            </div>
        </div>
    )    
}

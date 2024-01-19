import { CommentCreate } from "./CommentCreate"
import { CommentRead } from "./CommentRead"

export const CommentBox = ({slug}) => {       
    // useEffect(() => {
    //     const s = document.createElement('script');
    //     s.setAttribute("type","text/javascript");
    //     s.setAttribute("src", "https://www.powr.io/powr.js?platform=html");
    //     s.async = true;
    //     document.body.appendChild(s);
    //     return () => {
    //       document.body.removeChild(s);
    //     }
    //   }, []);

    return (
        <>
            <div className="container text-muted">
                <CommentCreate slug={slug}/>
                <CommentRead slug={slug}/>
            </div>
        </>
    )
}


 

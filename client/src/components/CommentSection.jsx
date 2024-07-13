import { useContext, useState, useEffect } from "react";
import { UserContext } from "../userContext/UserContext";
import axios from "axios";
import Editor from "./Editor";
import Comment from "./Comment";


export default function CommentSection({ postid }) {

    let allowSubmit = true;
    const [content, setContent] = useState('');
    const { userInfo } = useContext(UserContext);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        axios.get(`/comment/${postid}`).then(response => {
            setComments(response.data);
        });
    }, [postid]);


    async function postComment(ev) {
        if (allowSubmit) {
            allowSubmit = false;
            const data = {
                content: content,
                post: postid
            };
            const response = await axios.post('/comment', JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });
            if (response.status >= 200 && response.status < 300) {
                axios.get(`/comment/${postid}`).then(response => {
                    setComments(response.data);
                });
                setContent('');
                allowSubmit = true;
            }
        } else
            return false;
    }
    return (
        <div className="comment-section">
            {userInfo && <div className="comment-editor">
                <Editor hasModules={false} onChange={setContent} value={content} placeholder={"Leave a comment!"} />
                {(content && content !== "<p><br></p>") && <button className="post-comment-btn" onClick={postComment}>Post comment</button>}
                <hr></hr>
            </div>}

            <div className="comments">
                {comments.length > 0 && comments.map(comment => (
                    <Comment key={comment._id} {...comment} id={comment._id} />
                ))}
            </div>
        </div>
    );
}
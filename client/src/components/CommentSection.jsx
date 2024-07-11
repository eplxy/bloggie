import { useContext, useEffect, useState } from "react";
import DOMPurify from 'dompurify';
import { UserContext } from "../userContext/UserContext";
import axios from "axios";
import Editor from "./Editor";


export default function CommentSection() {

    let allowSubmit = true;
    const [redirect, setRedirect] = useState(false);     
    const [content, setContent] = useState('');
    const { userInfo } = useContext(UserContext);


    async function postComment(ev) {

        if (allowSubmit) {
            allowSubmit = false;
            const data = new FormData();
            data.set('content', content);
            ev.preventDefault();
            const response = await axios.post('/post', data, {
                credentials: 'include',
            });
            if (response.status >= 200 && response.status < 300) {
                setRedirect(true);
            }
        } else
            return false;
    }

    return (
        <div className="comment-section">
            <div className="comment-editor">
                {userInfo && <Editor onChange={setContent} value={content} placeholder={"Leave A Comment"} />}
                <button onClick={postComment}></button>
            </div>
            <div className="comments">
                {/* map out all comments for this post  */}
            </div>
        </div>
    );
}
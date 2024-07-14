import React, { useContext, useState, useEffect } from 'react';
import ReactTimeAgo from 'react-time-ago';
import DOMPurify from 'dompurify';
import { UserContext } from '../userContext/UserContext';
import Popup from 'reactjs-popup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Comment({ createdAt, author, content, id, likes }) {
    const date = new Date(createdAt);
    const { userInfo } = useContext(UserContext);
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);


    useEffect(() => {
        setLiked(likes?.includes(userInfo?.username));
        setLikeCount(likes?.length);
    }, [likes, userInfo?.username]);

    async function deleteComment(ev) {
        ev.preventDefault();
        const response = await axios.delete('/comment/' + id, {
            useCredentials: true,
        });
        if (response.status === 204) {
            navigate(0);
        }
    }

    async function updateLiked(ev) {
        ev.preventDefault();

        const response = await axios.put('/comment/like',
            { 'username': userInfo.username, 'id': id },
            { withCredentials: true, });

        setLiked(!liked);
        // setInfo({ ...response.data.likes, ...commentInfo });
        setLikeCount(response.data.likes.length);

    }


    return (
        <div className="comment">
            <div className="comment-info">
                <p className="author-info">
                    <span className="author">{author.username}</span>
                    <ReactTimeAgo date={date} locale="en-CA" />
                </p>
                <div className="comment-btn-row">

                    {(userInfo && userInfo.username === author.username) && <div className="comment-delete">
                        <Popup className="confirm-delete" trigger=
                            {<span className="comment-delete-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </span>} modal nested >
                            {
                                close => (
                                    <div className='modal'>
                                        <div className='content'>
                                            Are you sure you want to delete this comment?
                                        </div>
                                        <div className="choice-row">
                                            <button className="cancel-btn" onClick=
                                                {() => close()}>
                                                Cancel
                                            </button>
                                            <button className="confirm-delete-btn" onClick=
                                                {deleteComment}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        </Popup>
                    </div>
                    }
                    <div className='like-btn-and-count'>
                        <span className={liked ? "comment-like-btn-liked" : "comment-like-btn"} onClick={userInfo ? updateLiked : null}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </span>
                        <span className='like-count'>{likeCount} </span>
                    </div>

                </div>
            </div>
            <div className="content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.replace('<p><br></p>', '')) }}></div>
        </div>
    );
}
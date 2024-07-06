import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from 'dompurify';
import { UserContext } from "../userContext/UserContext";
import Popup from 'reactjs-popup';
import { Link } from 'react-router-dom';
import Image from '../components/Image';
import axios from "axios";

export default function PostPage() {




    const { userInfo } = useContext(UserContext)
    const [postInfo, setPostInfo] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        axios.get(`/post/${id}`)
            .then(response => {
                setPostInfo(response.data);
            });
    }, [id]);


    async function deletePost(ev) {
        ev.preventDefault();
        const response = await axios.delete('/post/' + id, {
            credentials: 'include',
        });
        if (response.status === 204) {
            navigate('/');
        }

    }
    const catCoverUrl = useMemo(() => {
        return postInfo?.cover ? postInfo.cover : "https://cataas.com/cat?type=medium";
    }, [postInfo?.cover]);

    if (!postInfo) return "";
    return (
        <div className="post-page">
            <h1 className="title">{postInfo.title}</h1>
            <time>{postInfo.createdAt}</time>
            <div className="author">by @{postInfo.author.username}</div>
            {userInfo && (userInfo.id === postInfo.author._id && (
                <div className="edit-delete">
                    <div className="edit">
                        <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                            Edit
                        </Link>
                    </div>
                    <div className="delete">

                        <Popup className="confirm-delete" trigger=
                            {<span className="delete-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Delete
                            </span>} modal nested >
                            {
                                close => (
                                    <div className='modal'>
                                        <div className='content'>
                                            Are you sure you want to delete this post?
                                        </div>
                                        <div className="choice-row">
                                            <button className="cancel-btn" onClick=
                                                {() => close()}>
                                                Cancel
                                            </button>
                                            <button className="confirm-delete-btn" onClick=
                                                {deletePost}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )
                            }

                        </Popup>
                    </div>
                </div>
            ))}
            <div className="image">
                <Image src={catCoverUrl} alt=""></Image>
            </div>
            <div className="content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(postInfo.content) }}></div>
        </div>
    );
}
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import Image from './Image';

export default function Post({ _id, title, summary, cover, createdAt, author, likeCount }) {
    const date = new Date(createdAt);


    // Memoize the cat image URL so it only changes if `cover` changes
    const catImageUrl = useMemo(() => {
        return cover ? cover : "https://cataas.com/cat?type=medium&" + (Math.floor(Math.random() * 101));
    }, [cover]);

    return (
        <div className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <Image alt="Post cover" src={catImageUrl}></Image>
                </Link>
            </div>
            <div className="texts">
                <Link to={`/post/${_id}`}>
                    <h2>{title}</h2>
                </Link>
                <p className="info">
                    <span className="author">{author.username}</span>
                    <ReactTimeAgo date={date} locale="en-CA" />
                    <span className='like-row'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        <span className='like-count'>{likeCount} </span>
                    </span>
                </p>
                <p className="summary">{summary}</p>
            </div>
        </div>
    );
}
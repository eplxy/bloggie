import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import Image from './Image';

export default function Post({ _id, title, summary, cover, createdAt, author }) {
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
                </p>
                <p className="summary">{summary}</p>
            </div>
        </div>
    );
}
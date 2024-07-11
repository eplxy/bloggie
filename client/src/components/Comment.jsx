import React from 'react';
import ReactTimeAgo from 'react-time-ago';
import DOMPurify from 'dompurify';


export default function Comment({ createdAt, author, content }) {
    const date = new Date(createdAt);


    return (
        <div className="comment">
            <div className="author-info">
                <p className="info">
                    <span className="author">{author.username}</span>
                    <ReactTimeAgo date={date} locale="en-CA" />
                </p>
            </div>
            <div className="content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}></div>
        </div>
    );
}
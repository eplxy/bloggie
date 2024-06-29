import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago'

export default function Post({ _id, title, summary, cover, content, createdAt, author }) {

    const date = new Date(createdAt);

    return (

        <div className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <img src={'http://localhost:4000/' + cover}></img>
                </Link>
            </div>
            <div className="texts">
                <Link to={`/post/${_id}`}>
                    <h2>{title}</h2>
                </Link>
                <p className="info">
                    <a className="author">{author.username}</a>
                    <ReactTimeAgo date={date} locale="en-CA" />
                </p>
                <p className="summary">{summary}</p>
            </div>
        </div >);


}
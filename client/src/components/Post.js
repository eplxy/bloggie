import ReactTimeAgo from 'react-time-ago'

export default function Post({ title, summary, cover, content, createdAt, author }) {

    const date = new Date(createdAt);

    return (<div className="post">
        <div className="image"><img src={'http://localhost:4000/' + cover}></img></div>
        <div className="texts">
            <h2>{title}</h2>
            <p className="info">
                <a className="author">{author.username}</a>
                <ReactTimeAgo date={date} locale="en-CA" />
            </p>
            <p className="summary">{summary}</p>
        </div>
    </div>);


}
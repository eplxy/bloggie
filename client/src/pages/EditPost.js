import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";
import axios from 'axios';

export default function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        axios.get('/post/' + id)
            .then(response => {
                setTitle(response.data.title);
                setContent(response.data.content);
                setSummary(response.data.summary);
            });
    }, [id]);

    async function updatePost(ev) {
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }

        const response = await axios.put('/post', data, {
            credentials: 'include',
        });
        if (response.status >= 200 && response.status < 300) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/post/' + id} />
    }

    return (
        <form onSubmit={updatePost}>
            <input type="title"
                placeholder={'Title'}
                value={title}
                onChange={ev => setTitle(ev.target.value)} />
            <input type="summary"
                placeholder={'Summary'}
                value={summary}
                onChange={ev => setSummary(ev.target.value)} />
            <div className="cover-row">
                <label htmlFor="cover-input" style={files[0] ? { display: "none" } : { display: "inline-flex" }} id="cover-input-label">{!files[0] ? "Set cover image" : ''}</label>
                <span className="cover-file-name">{files[0] ? files[0].name : ''}</span>
                <input id="cover-input" type="file" accept="image/*" onChange={ev => setFiles(ev.target.files)} />
            </div>
            <Editor onChange={setContent} value={content} />
            <button style={{ marginTop: '5px' }}>Update post</button>
        </form>
    );
}
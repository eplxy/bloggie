import { useEffect, useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import Editor from '../components/Editor'
import { UserContext } from '../userContext/UserContext';
import axios from 'axios';


export default function CreatePost() {

    var allowSubmit = true;

    const navigate = useNavigate();

    const { userInfo } = useContext(UserContext);
    useEffect(() => {

        if (!userInfo) {
            navigate('/');
        }

    });

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);


    async function createNewPost(ev) {

        if (allowSubmit) {
            allowSubmit = false;
            const data = new FormData();
            data.set('title', title);
            data.set('summary', summary);
            data.set('content', content);
            data.set('file', files[0]);
            ev.preventDefault();
            const response = await axios.post('/post', data,{
                credentials: 'include',
            });
            if (response.status >= 200 && response.status < 300) {
                setRedirect(true);
            }
        } else
            return false;
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <form onSubmit={createNewPost}>
            <input type="title"
                placeholder={'Title'}
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />
            <input type="summary"
                placeholder={'Summary'}
                value={summary}
                onChange={ev => setSummary(ev.target.value)}
            />
            <input type="file" accept="image/*"
                onChange={ev => setFiles(ev.target.files)}
            />
            <Editor onChange={setContent} value={content} />

            <button style={{ marginTop: '5px' }}>Create post</button>
        </form>


    );


}
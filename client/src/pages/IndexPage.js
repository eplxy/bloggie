import Post from "../components/Post";
import { useEffect, useState } from "react";
import axios from 'axios';

export default function IndexPage() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('/post',).then(response => {
            setPosts(response.data);
        });

    }, []);
    return (
        <>
            {posts.length > 0 && posts.map(post => (
                <Post key={post._id} {...post} />
            ))}
        </>
    )
}
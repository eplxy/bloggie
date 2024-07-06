import { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../userContext/UserContext";
import axios from 'axios';


export default function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { userInfo, setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    });


    async function login(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post('/login', { username, password }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (response.status >= 200 && response.status < 300) {
                setUserInfo(response.data);
                setRedirect(true);
            }
        } catch (e) {
            alert('Invalid credentials. Please try again.');
        }
    }


    if (redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input type="text" placeholder="username"
                value={username}
                onChange={ev => setUsername(ev.target.value)}
            />
            <input type="password" placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
            />
            <button>Login</button>
        </form>

    )
}
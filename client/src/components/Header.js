import { useEffect, useContext } from "react";
import { Link } from "react-router-dom"
import { UserContext } from "../userContext/UserContext";


export default function Header() {

    const { setUserInfo, userInfo } = useContext(UserContext);
    useEffect(() => {
        // Assuming the token is stored in local storage under the key 'token'
        const token = localStorage.getItem('token');
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    function logout() {
        // Assuming the token is stored in local storage under the key 'token'
        const token = localStorage.getItem('token');
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        setUserInfo(null);
        // Optionally, remove the token from local storage on logout
        localStorage.removeItem('token');
    }

    const username = userInfo?.username;

    return (<header>
        <Link to="/" className="logo">Bloggie</Link>
        <nav>
            {username && (<>
                <a><span style= {{fontWeight:"bold"}}>Hi there, {username}!</span></a>
                <Link to="/create">Create new post</Link>
                <a onClick={logout}>Logout</a>
            </>
            )}
            {!username && (<>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </>
            )}
        </nav>
    </header>);
}
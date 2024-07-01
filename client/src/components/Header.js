import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../userContext/UserContext";


export default function Header() {

    const navToHome = useNavigate();

    const {userInfo, setUserInfo } = useContext(UserContext);
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
    }, [setUserInfo]);

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
        navToHome('/');
    }

    const username = userInfo?.username;

    return (<header>
        <Link to="/" className="logo">Bloggie</Link>
        <nav>
            {username && (<>
                <span style={{ fontWeight: "bold" }}>Hi there, {username}!</span>
                <Link to="/create">Create new post</Link>
                <span onClick={logout} style={{cursor:"pointer"}}>Logout</span>
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
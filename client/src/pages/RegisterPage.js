import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext/UserContext";
import axios from "axios";

export default function RegisterPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();


    const { userInfo } = useContext(UserContext);
    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    });


    async function register(ev) {
        ev.preventDefault();

        if (confirmPassword !== password) {
            alert('Passwords do not match. Please try again.')
            return;
        }

        try {
            const response = await axios.post('/register', { username, password }, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 200) {
                alert('Registration successful. Now redirecting you to the login page.');
                navigate('/login');
            }
        } catch (e) {
            alert('Registration Failed. Username already exists!');
        }

    }

    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={ev => setUsername(ev.target.value)}
            />

            <input type="password" placeholder="Password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
            />
            <input type="password" placeholder="Confirm Password"
                value={confirmPassword}
                onChange={ev => setConfirmPassword(ev.target.value)}
            />
            <button>Register</button>
        </form>
    )
}
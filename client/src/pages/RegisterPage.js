import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();


    async function register(ev) {
        ev.preventDefault();

        if (confirmPassword !== password) {
            alert ('Passwords do not match. Please try again.')
            return;
        }


        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        })
        if (response.status === 200) {
            alert('Registration successful. Now redirecting you to the login page.');
            navigate('/login');
        } else {
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
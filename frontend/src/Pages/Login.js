import React, { useState } from 'react'
import '../Components/Header.css'
import './Styles/Login.css'
import api from '../API_URL/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setusername] = useState("");
    const [pass, setpass] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !pass) {
            alert('Both username and password are required');
            return;
        }
        const credentials = {
            "username": username,
            "password": pass
        }
        try {
            const response = await api.post('/auth/login', credentials, {
                withCredentials: true
            });

            if (response.status === 200) {
                localStorage.setItem('username', response.data.username);
                navigate('/dashboard');
            }
            else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("error occured");
        }
    }
    return (
        <>
            <header className="header">
                <div className="logo">
                    <h1 className='lo'>LO<span className='go'>GO</span></h1>
                </div>
            </header>
            <h2 className='title'>Login</h2>
            <div className='login'>
                <form className='formdet' onSubmit={handleSubmit}>
                    <div className='username'>
                        <label for='user'>Username:</label>
                        <input type='text' id='user' name='Username' value={username} onChange={(e) => setusername(e.target.value)} placeholder='Enter Username' />
                    </div>
                    <div className='password'>
                        <label for='pass'>Password:</label>
                        <input type='password' id='pass' name='password' value={pass} onChange={(e) => setpass(e.target.value)} placeholder='Enter Password' />
                    </div>
                    <button className='loginbtn' type='submit'>Login</button>
                </form>
            </div>
        </>
    )
}

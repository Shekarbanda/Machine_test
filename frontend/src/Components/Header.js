import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css'; 

export default function Header() {
    const [menuclick,setmenuclick] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('username'); 
        navigate('/'); 
    };

    const name = localStorage.getItem('username');

    return (
        <header className="header">
            <div className="logo">
                <h1 className='lo'>LO<span className='go'>GO</span></h1>
            </div>
            <nav className={`navbar ${menuclick?'active':''}`}>
                <NavLink className={({ isActive }) => (isActive ? 'link hov underline' : 'link hov') } to="/dashboard">Home</NavLink>
                <NavLink className={({ isActive }) => (isActive ? 'link hov underline' : 'link hov') } to="/employeelist">Employee List</NavLink>
                <div className='profile'>
                    <p className='name'>{name} - </p>
                    <span className='btn hov' onClick={handleLogout}>Logout</span>
                </div>
            </nav>
            <p className={`menu ${menuclick?'cancel':''}`} onClick={()=>setmenuclick(!menuclick)}>{menuclick?`×`:"☰"}</p>
        </header>
    );
};



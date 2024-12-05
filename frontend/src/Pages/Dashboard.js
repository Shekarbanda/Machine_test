import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import './Styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/'); 
        }
    }, [navigate]);

    

    return (
        <>
        <Header/>
        <div className='dashboard'>
            <h2>Welcome to</h2>
            <h3>Admin Panel</h3>
        </div>
        </>
    );
};

export default Dashboard;

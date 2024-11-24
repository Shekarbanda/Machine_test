import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import './Styles/EmployeeList.css';
import { useNavigate } from 'react-router-dom';
import api from '../API_URL/api';

export default function EmployeeList() {
    const nav = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            nav('/');
        }
    }, [nav]);

    const [employees, setEmployees] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder] = useState('asc');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get('/employees', {
                    params: {
                        search: searchTerm,
                        page,
                        limit: 10,
                        sortBy,
                        order: sortOrder, 
                    },
                    withCredentials: true,
                });
                if (response) {
                    setEmployees(response.data.employees);
                    setTotalCount(response.data.totalCount);
                    setTotalPages(response.data.totalPages);
                }
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchEmployees();
    }, [searchTerm, page, sortBy]);

    const toggleStatus = async (employeeId, currentStatus) => {
        try {
            const response = await api.put(`/employees/${employeeId}/status`, {
                isActive: !currentStatus,
            });
            if (response.status === 200) {
                setEmployees((prev) =>
                    prev.map((employee) =>
                        employee._id === employeeId
                            ? { ...employee, isActive: !currentStatus }
                            : employee
                    )
                );
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const deleteEmployee = async (employeeId) => {
        try {
            const response = await api.delete(`/employees/${employeeId}`);
            if (response.status === 200) {
                setEmployees((prev) => prev.filter((employee) => employee._id !== employeeId));
                setTotalCount((prev) => prev - 1);
                alert('Employee deleted successfully');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Error deleting employee');
        }
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    const handleSortChange = (e) => {
        setSortBy(e.target.value); 
    };

    return (
        <div className='main'>
            <Header />
            <div className='list'>
                <h1 className='head'>Employee List</h1>
            </div>
            <hr />
            <div className='first'>
                <p className='count'>Total Count : {totalCount}</p>
                <button className='createbtn' onClick={() => nav('/employeeform')}>Create Employee</button>
            </div>
            <div className='data'>
                <div className='emp'></div>
            <div className='sort search'>
                    <label htmlFor="sortBy" className='tit'>Sort By:</label>
                    <select id="sortBy" value={sortBy} onChange={handleSortChange} className='sel' >
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="createdAt">Created Date</option>
                    </select>
                </div>
                <div className='search'>
                    <p className='tit'>Search</p>
                    <input
                        className='sinput'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder='Enter Search Keyword'
                    />
                </div>
                <p className='col'>Unique Id</p>
                <p className='col'>Image</p>
                <p className='col'>Name</p>
                <p className='col'>Email</p>
                <p className='col'>Mobile No</p>
                <p className='col'>Designation</p>
                <p className='col'>Gender</p>
                <p className='col'>Course</p>
                <p className='col'>Created Date</p>
                <p className='col'>Status</p>
                <p className='col bor'>Action</p>
                {employees?.map((employee) => (
                    <>
                        <p className='col1'>{((page-1)*10)+employees.indexOf(employee)+1}</p>
                        <div className='imgdiv'>
                            <img
                                src={employee.image}
                                className='img'
                                alt='profile-pic'
                                width={70}
                                height={70}
                            />
                        </div>
                        <p className='col1'>{employee.name}</p>
                        <p className='col1'>{employee.email}</p>
                        <p className='col1'>{employee.mobile}</p>
                        <p className='col1'>{employee.designation}</p>
                        <p className='col1'>{employee.gender}</p>
                        <p className='col1'>{employee.course.join(', ')}</p>
                        <p className='col1'>{new Date(employee.createdAt).toLocaleDateString()}</p>
                        <p className='status'>
                            <p className={employee.isActive ? 'active' : 'inactive'}>
                                <span className={employee.isActive ? 'dota' : 'dotd'}></span>
                                <span>{employee.isActive ? 'Active' : 'Inactive'}</span>
                            </p>
                            <button
                                className={employee.isActive ? 'deactivate btns' : 'activate btns'}
                                onClick={() => toggleStatus(employee._id, employee.isActive)}
                            >
                                {employee.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                        </p>
                        <p className='col1 etc'>
                            <button className='btns' onClick={() => nav(`/employeeedit/${employee._id}`)}>Edit</button>
                            <button className='btns' onClick={() => deleteEmployee(employee._id)}>Delete</button>
                        </p>
                    </>
                ))}
            </div>
            {/* Pagination Controls */}
            <div className='pagination'>
                <button
                    className='pagebtn'
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className='pagenum'>Page {page} of {totalPages}</span>
                <button
                    className='pagebtn'
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

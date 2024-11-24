import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import EmployeeList from './Pages/EmployeeList';
import EmployeeForm from './Pages/EmployeeForm';
import EmployeeEdit from './Pages/EmployeeEdit';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path='/employeelist' element={<EmployeeList/>} />
                <Route path='/employeeform' element={<EmployeeForm/>} />
                <Route path='/employeeedit/:id' element={<EmployeeEdit/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;

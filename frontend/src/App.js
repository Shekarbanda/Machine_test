import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import EmployeeList from './Pages/EmployeeList';
import EmployeeForm from './Pages/EmployeeForm';
import EmployeeEdit from './Pages/EmployeeEdit';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import CourseMaster from './Pages/CourseMaster';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path='/employeelist' element={<EmployeeList/>} />
                <Route path='/employeeform' element={<EmployeeForm/>} />
                <Route path='/employeeedit/:id' element={<EmployeeEdit/>} />
                <Route path='/coursemaster' element={<CourseMaster/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default App;

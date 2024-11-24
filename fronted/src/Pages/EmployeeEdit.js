import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../API_URL/api';
import Header from '../Components/Header';

export default function EmployeeEdit() {
    const { id } = useParams(); 
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: [],
        image: '', 
    });
    const resetButtonRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await api.get(`/employees/${id}`);
                if (response.data && response.data.employee) {
                    const { name, email, mobile, designation, gender, course, image } = response.data.employee;
                    setFormData({ name, email, mobile, designation, gender, course, image });
                } else {
                    alert('Failed to load employee data');
                }
            } catch (error) {
                console.error('Error fetching employee data:', error);
                alert('Error loading employee data');
            }
        };

        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'course') {
            setFormData((prev) => ({
                ...prev,
                course: prev.course.includes(value)
                    ? prev.course.filter((item) => item !== value) 
                    : [...prev.course, value], 
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    image: reader.result, 
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put(`/employees/${id}`, formData);
            if (response.status === 200) {
                alert('Employee updated successfully');
                navigate('/employeelist'); 
            } else {
                alert('Failed to update employee');
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            alert('Error updating employee');
        }
    };

    return (
        <div className='main'>
            <Header/>
            <div className='body'>
            <h1 className='head'>Edit Employee</h1>
            <form className='form' onSubmit={handleSubmit}>
                <div className='Name'>
                    <label for='name'>Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='Email'>
                    <label for='email'>Email:</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='Mobile'>
                    <label for='mobile'>Mobile No:</label>
                    <input
                        type="text"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='desg'>
                    <label for="designation">Designation:</label>
                    <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Designation</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                </div>
                <div className='gen'>
                    <label>Gender:</label>
                    <div className='rad'>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={formData.gender === 'Male'}
                                onChange={handleChange}
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={formData.gender === 'Female'}
                                onChange={handleChange}
                            />
                            Female
                        </label>
                    </div>
                </div>
                <div className='cos'>
                    <label>Course:</label>
                    <div className='rad'>
                        <label>
                            <input
                                type="checkbox"
                                name="course"
                                value="MCA"
                                checked={formData.course.includes('MCA')}
                                onChange={handleChange}
                            />
                            MCA
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="course"
                                value="BCA"
                                checked={formData.course.includes('BCA')}
                                onChange={handleChange}
                            />
                            BCA
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="course"
                                value="BSC"
                                checked={formData.course.includes('BSC')}
                                onChange={handleChange}
                            />
                            BSC
                        </label>
                    </div>
                </div>
                <div className='imgmain' style={{display:'flex',height:'50px',alignItems:'center',gap:'10px'}}>
                    <label for='image'>Image Upload:</label>
                    <div className='imgup' style={{display:'flex',gap:'5px'}}>
                    <img src={formData.image}  className='imge' width={50} height={50}/>
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        accept=".jpg,.png"
                    />
                    </div>
                </div>
                <div className='btns2'>
                    <button type="submit" className='subbtn'>Update</button>
                    <button type="reset" ref={resetButtonRef} className='subbtn'>Reset</button>
                </div>
            </form>
            </div>
        </div>
    );
}

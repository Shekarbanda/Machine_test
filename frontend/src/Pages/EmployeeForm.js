import React, { useEffect, useRef, useState } from 'react';
import Header from '../Components/Header';
import './Styles/EmployeeForm.css'
import { useNavigate } from 'react-router-dom';
import api from '../API_URL/api';

const EmployeeForm = () => {
    const [load, setLoad] = useState(false);
    const [allcourses,setallcourses]=useState([])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: [],
        image: null,
    });

    const initialFormData = {
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: [],
        image: null,
    };

    const navigate = useNavigate();
    const resetButtonRef = useRef();

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/');
        }
    }, [navigate]);

    // Handle image selection and set as File object
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file, 
            });
        }
    };

    const handleSubmit = async (e) => {
        setLoad(true);
        e.preventDefault();

        try {
            const data = new FormData(); 
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('mobile', formData.mobile);
            data.append('designation', formData.designation);
            data.append('gender', formData.gender);
            formData.course.forEach((item) => {
            data.append('course', item); 
          }); 
            
            if (formData.image) {
                data.append('image', formData.image); 
            }

            const response = await api.post('/employees', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });

            if (response.status === 200) {
                setFormData(initialFormData);
                if (resetButtonRef.current) {
                    resetButtonRef.current.click();
                }
                alert('Employee created successfully');
                navigate('/employeelist');
            } 
            else {
                alert(response.data.message);
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoad(false);
        }
    };

    
    useEffect(() => {

        const fetchcourses = async () => {
            try {
                const response = await api.get('/coursemaster');
                console.log(response.data.courses)
                if (response.status==200) {
                    setallcourses(response.data.courses);
                }
                else{
                    alert("failed")
                }
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchcourses();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        if (type === 'checkbox') {
            setFormData((prev) => ({
                ...prev,
                course: checked
                    ? [...prev.course, value] 
                    : prev.course.filter((item) => item !== value), 
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };
    

    return (
        <div className='main'>
            <Header/>
        <div className='body'>
            <h1 className='t'>Create Employee</h1>
        <form className='form' onSubmit={handleSubmit}>
            <div className='Name'>
                <label for='name'>Name:</label>
                <input type="text" id='name' name="name" placeholder="Name" onChange={handleChange} required />
            </div>
            <div className='Email'>
                <label for='email'>Email:</label>
                <input type="text" id='email' name="email" placeholder="Email" onChange={handleChange} required />
            </div>
            <div className='Mobile'>
                <label for='mobile'>Mobile No:</label>
                <input type="text" id='mobile' name="mobile" placeholder="Mobile" onChange={handleChange} required />
            </div>
            <div className='desg'>
                <label id='des'>Designation</label>
                <select name="designation" onChange={handleChange} required>
                    <option value="">Select Designation</option>
                    <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales">Sales</option>
                </select>
            </div>
            <div className='gen'>
                <label id='gend'>Gender</label>
                <div className='rad'>
                <label>
                    <input type="radio" name="gender" value="Male" onChange={handleChange} required />
                    Male
                </label>
                <label>
                    <input type="radio" name="gender" value="Female" onChange={handleChange} required />
                    Female
                </label>
                </div>
            </div>
            <div className='cos'>
                <label>Course</label>
                <div className='rad'>
                {allcourses?.map((c, index) => (
                    <React.Fragment key={index}>
                        <label>
                    <input type="checkbox" name={c.course} value={c.course} onChange={handleChange} />
                    {c.course}
                </label>
                    </React.Fragment>
                ))}
                </div>
            </div>
           <div className='imgup'>
           <label className='image'>Img Upload</label>
           <input type="file" name="image" onChange={handleImageChange} accept=".jpg,.png" required />
           </div>
            <div className='btns2'>
            <button type="submit" className='subbtn'>{load?"Creating...":"Create"}</button>
            <button type="reset" ref={resetButtonRef} className='subbtn'>Reset</button>
            </div>
        </form>
        </div>
        </div>
    );
};

export default EmployeeForm;

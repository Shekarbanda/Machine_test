import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../API_URL/api';
import Header from '../Components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { getcourses } from '../Redux/Slices/CourseSlice';

export default function EmployeeEdit() {
    const { id } = useParams();
    const [load, setLoad] = useState(false);
    const dispatch = useDispatch();
    const allcourses = useSelector((state)=>state.cor.courses);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: [],
        image: null, 
    });

    useEffect(() => {

        const fetchcourses = async () => {
            try {
                const response = await api.get('/coursemaster');
                console.log(response.data.courses)
                if (response.status==200) {
                    dispatch(getcourses(response.data.courses));
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


    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch employee data
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file, 
            });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoad(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('mobile', formData.mobile);
        data.append('designation', formData.designation);
        data.append('gender', formData.gender);
        formData.course.forEach((item) => {
            data.append('course', item); // Append each item separately
          }); 

        if (formData.image) {
            data.append('image', formData.image); 
        } else if (formData.image === null && imagePreview) {
            data.append('image', imagePreview); 
        }

        try {
            const response = await api.put(`/employees/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                alert('Employee updated successfully');
                navigate('/employeelist');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert('Error ',error);
            console.log(error);
        } finally {
            setLoad(false);
        }
    };

    return (
        <div className='main'>
            <Header/>
            <div className='body'>
            <h1 className='t'>Edit Employee</h1>
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
                    {allcourses?.map((c, index) => (
                        <React.Fragment key={index}>
                            <label>
                        <input type="checkbox" name={c.course} value={c.course} checked={formData.course.includes(c.course)}
                                onChange={handleChange}/>
                        {c.course}
                        </label>
                        </React.Fragment>
                    ))}
                    </div>
                </div>
                <div className='imgmain' style={{display:'flex',height:'50px',alignItems:'center',gap:'10px'}}>
                    <label for='image'>Image Upload:</label>
                    <div className='imgup' style={{display:'flex',gap:'5px'}}>
                    <img src={imagePreview?imagePreview:`https://employee-management-system-backend-nvdf.onrender.com/${formData.image}`} className='imge' width={50} height={50}/>
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                       
                    />
                    </div>
                </div>
                <div className='btns2'>
                    <button type="submit" className='subbtn'>{load?"Updating...":"Update"}</button>
                </div>
            </form>
            </div>
        </div>
    );
}

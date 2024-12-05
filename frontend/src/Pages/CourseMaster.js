import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import './Styles/course.css'
import { useNavigate } from 'react-router-dom';
import api from '../API_URL/api';
import { useDispatch,useSelector} from 'react-redux';
import { getcourses } from '../Redux/Slices/CourseSlice';

export default function CourseMaster() {
    const [course,setcourse] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const allcourses = useSelector((state)=>state.cor.courses);

    const [load,setload] = useState(false);
    const [editload,seteditload] = useState(null);
    const [delload,setdelload] = useState(null);
    const [createload,setcreateload] = useState(null);

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/'); 
        }
    }, [navigate]);


    useEffect(() => {
        const fetchcourses = async () => {
            setload(true);
            try {
                const response = await api.get('/coursemaster');
                if (response.status==200) {
                    dispatch(getcourses(response.data.courses));
                }
                else{
                    alert("failed")
                }
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
            finally {
                setload(false);
            }
        };

        fetchcourses();
    }, []);

    const handlesubmit=async (e)=>{
        setcreateload(true);
        e.preventDefault();
        const course1 = {course:course}
        try{
            const response = await api.post('/coursemaster', course1, {
                withCredentials: true,
            });
            if(response.status==200){
                alert(response.data.message);
                dispatch(getcourses(response.data.courses));
                setcourse("");
            }
            else{
                alert(response.data.message);
            }
        }
        catch(e){
            alert("error occured",e);
            console.log(e)
        }
        finally{
            setcreateload(false);
        }
    }

    const deletecourse = async (courseId,oldcor) => {
        setdelload(courseId);
        try {
            const response = await api.delete(`/coursemaster/${courseId}`);
            if (response.status === 200) {
                dispatch(getcourses(response.data.courses));
                empcourseudelete(oldcor)
                alert('Course deleted successfully');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('Error deleting course');
        }
        finally{
            setdelload(null);
        }
    };


    
    const editcourse = async (courseId, oldCourse) => {
        seteditload(courseId);
        const newCourse = prompt("Enter new course name:", oldCourse);
        if (!newCourse) {
            alert('Course name cannot be empty');
            return;
        }
    
        try {
            const response = await api.put(`/coursemaster/${courseId}`, { course: newCourse });
            if (response.status === 200) {
                dispatch(getcourses(response.data.courses));
                
                alert('Course updated successfully');
                empcourseupdate(oldCourse,newCourse)
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error updating course:', error);
            alert('Error occurred while updating the course');
        }
        finally{
            seteditload(null);
        }
    };

    const empcourseupdate = async (oldCourse, newCourse) => {
        if (!oldCourse || !newCourse) {
            alert('Please provide both old and new course names');
            return;
        }
    
        try {
            const response = await api.post('/employees/course', {
                oldc: oldCourse, 
                newc: newCourse,
            });
    
        } catch (error) {
            console.error('Error updating courses:', error);
        }
    };
    
    
    const empcourseudelete = async (courseToDelete) => {
        try {
            const response = await api.post('/employees/course/delete', {
                course: courseToDelete, 
            });

        } catch (error) {
            console.error('Error updating courses:', error);
        }
    };
    
  return (
    <div className='main'>
            <Header/>
        <div className='body'>
            <h1 className='t'>Course Master</h1>
        <form className='form' onSubmit={handlesubmit}>
            <div className='Name'>
                <label for='course'>Course:</label>
                <input type="text" id='course' name="course" placeholder="Name" value={course} onChange={(e)=>setcourse(e.target.value)} required />
            </div>
            <button type="submit" className='subbtn1'>{createload?"Creating...":"Create"}</button>
        </form>
    </div>
    <div className='courses'>
        <p className='col'>Reg.No</p>
        <p className='col'>Course</p>
        <p className='col'>Actions</p>
        {
            load ? <div className='load'>
                        <p>Loading....</p>
                    </div> : ""
                }
        {
        !load?allcourses?.map((c, index) => (
        <React.Fragment key={index}>
            <p className='col1'>{index + 1}</p>
            <p className='col1'>{c.course}</p>
            <div className='col1'>
                <button className='subbtn' onClick={()=>editcourse(c._id,c.course)}>{editload==c._id?"Editing...":"Edit"}</button>
                <button className='subbtn' onClick={()=>deletecourse(c._id,c.course)}>{delload==c._id?"Deleting...":"Delete"}</button>
            </div>
        </React.Fragment>
    )):""}
    </div>
    </div>

  )
}

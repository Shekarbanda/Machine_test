import {configureStore} from '@reduxjs/toolkit'
import CourseSlice from './Slices/CourseSlice'

export const store = configureStore({
    reducer:{
        cor:CourseSlice
    }
})
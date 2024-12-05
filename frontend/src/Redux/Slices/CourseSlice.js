import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courses: [],
};

const courseSlice = createSlice({
  name: 'cor',
  initialState,
  reducers: {
    getcourses: (state, action) => {
      state.courses = action.payload; // Update courses with payload data
    },
  },
});

export const { getcourses } = courseSlice.actions;
export default courseSlice.reducer;

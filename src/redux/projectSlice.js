import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    projects: [],
    currentProject: null,
};

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setProjects: (state, action) => {
            state.projects = action.payload;
        },
        setCurrentProject: (state, action) => {
            state.currentProject = action.payload;
            state.tasks = action.payload?.tasks || [];
        },
        addTask: (state, action) => {
            state.currentProject.tasks.push(action.payload);
        },
        updateTask: (state, action) => {
            state.tasks = state.tasks.map((task) =>
                task._id === action.payload._id ? action.payload : task
            );
        },
        deleteTasks: (state, action) => {
            state.currentProject.tasks = state.currentProject.tasks.filter((task) => !action.payload.includes(task._id));
        },
    },
});

export const { setProjects,
    setCurrentProject,
    addTask,
    updateTask,
    deleteTasks } =
    projectSlice.actions;
export default projectSlice.reducer;

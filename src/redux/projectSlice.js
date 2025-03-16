import { createSlice } from "@reduxjs/toolkit";
import tasks from "@/components/Tasks.jsx";

const initialState = {
    username:null,
    projects: [],
    currentProject: null,
    tasks:[],
    loadingTasks:true,
};

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setLoadingTasks: (state, action) => {
            state.loadingTasks = action.payload;
        },
        setProjects: (state, action) => {
            state.projects = action.payload;
        },
        setCurrentProject: (state, action) => {
            state.currentProject = action.payload;
            state.tasks = action.payload?.tasks || [];
        },
        setTasksList: (state, action) => {
            state.tasks = action.payload;
        },
        setUsername:(state, action)=>{
            state.username = action.payload;
        }
        ,
        addTask: (state, action) => {
            state.tasks.push(action.payload);
            ("after adding task", state.tasks);
        },
        updateTask: (state, action) => {
            ("before update",state.tasks)
            state.tasks = state.tasks.map((task) =>
                task._id === action.payload._id ? {...task,...action.payload} : {...task}
            );
            ("after update",state.tasks)
        },
        deleteTasks: (state, action) => {
            state.tasks = state.tasks.filter((task) => !action.payload.includes(task._id));
        },
    },
});

export const {
    setProjects,
    setUsername,
    setCurrentProject,
    setTasksList,
    addTask,
    updateTask,
    deleteTasks,
    setLoadingTasks
} = projectSlice.actions;
export default projectSlice.reducer;

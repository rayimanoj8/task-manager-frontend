import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./projectSlice";

export const store = configureStore({
    reducer: {
        project: projectReducer, // ✅ Register project slice
    },
});

export default store;

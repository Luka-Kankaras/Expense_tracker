import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    page: "",
    records: [],
    types: []
};

export const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
       setLogin: (state, action) => {
           state.user = action.payload.user;
           state.token = action.payload.token;
       },
       setLogout: (state) => {
           state.user = null;
           state.token = null;
       },
       setRecords: (state, action) => {
           state.records = action.payload.records;
       },
       setTypes: (state, action) => {
           state.types = action.payload.types;
       },
       setPage: (state, action) => {
           state.page = action.payload.page;
       }
   }
});

export const { setLogin, setLogout, setRecords, setTypes, setPage } = authSlice.actions;
export default authSlice.reducer;
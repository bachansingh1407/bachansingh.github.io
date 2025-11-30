import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const sendMailAction = createAsyncThunk(
    'mail/sendMailAction', async (data, thunkAPI) => {
        try{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sendMail`, data); // Added await
            return res.data;
        } catch(error){
            return thunkAPI.rejectWithValue(error.response?.data?.error || "Internal server error");
        }
    }
)

const mailSlice = createSlice({
    name:"mail",
    initialState:{
        sendMailLoader:false,
        sendMailData:null,
        sendMailError:null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(sendMailAction.pending, (state) => {
            state.sendMailLoader = true;
            state.sendMailError = null;
        })
        .addCase(sendMailAction.fulfilled, (state, action) => {
            state.sendMailLoader = false;
            state.sendMailData = action.payload;
        })
        .addCase(sendMailAction.rejected, (state, action) => {
            state.sendMailLoader = false;
            state.sendMailError = action.payload;
        })
    }
})

export default mailSlice.reducer;
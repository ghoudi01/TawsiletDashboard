import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getLocalisation = createAsyncThunk(
  "localisation/all",
  async () => {
    try {
      const jwt = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}locations?pLevel=4`,{
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  locations: [],

  status: null,
  error: null,
  isLoading: false,
};
export const localisationSlice = createSlice({
  name: "localisation",
  initialState,
  reducers: {},
  extraReducers: {
    [getLocalisation.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getLocalisation.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.locations = action.payload?.data;
    },
    [getLocalisation.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
  },
});
export default localisationSlice.reducer;

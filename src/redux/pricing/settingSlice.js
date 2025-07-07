import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const jwt = localStorage.getItem("token");
export const getPrices = createAsyncThunk("prices/all", async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}settings?sort=id:asc&populate[0]=icon`,{
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const updatePrices = createAsyncThunk(
  "prices/update",
  async ({ id, newPrice }) => {
    const jwt = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKUP_URL}settings/${id}`,
        newPrice,
        {
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
  prices: [],

  updatedPrice: null,
  meta: [],
  status: null,
  error: null,
  isLoading: false,
};
export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},
  extraReducers: {
    [getPrices.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getPrices.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.prices = action.payload;
      state.meta = action.payload;
    },
    [getPrices.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },

    [updatePrices.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [updatePrices.fulfilled]: (state, action) => {
      state.status = "success";
      state.updatedPrice = action.payload;
      state.isLoading = false;
    },
    [updatePrices.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
    },
  },
});
export default settingSlice.reducer;

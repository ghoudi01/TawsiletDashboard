import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch balance data
export const fetchBalanceData = createAsyncThunk(
  "balance/fetchBalanceData",
  async (periodeFilter, { rejectWithValue }) => {
    const jwt = localStorage.getItem("token");
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKUP_URL}balance`,
        {
          periodeFilter: periodeFilter,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Balance slice
const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalanceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalanceData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBalanceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default balanceSlice.reducer;
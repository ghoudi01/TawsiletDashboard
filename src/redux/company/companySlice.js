import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get all companies
export const getCompanies = createAsyncThunk("companies/getAll", async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${process.env.REACT_APP_BACKUP_URL}companies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Get a company by ID
export const getCompanyById = createAsyncThunk("companies/getById", async ({id}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${process.env.REACT_APP_BACKUP_URL}companies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Create a new company
export const createCompany = createAsyncThunk("companies/create", async (company) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${process.env.REACT_APP_BACKUP_URL}companies`, company, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Update a company
export const updateCompany = createAsyncThunk("companies/update", async ({ id, company }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${process.env.REACT_APP_BACKUP_URL}companies/${id}`, {data:company}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Delete a company
export const deleteCompany = createAsyncThunk("companies/delete", async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${process.env.REACT_APP_BACKUP_URL}companies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Initial state
const initialState = {
  companies: [],
  viewedCompany: null,
  createdCompany: null,
  updatedCompany: null,
  deletedCompany: null,
  status: null,
  error: null,
  isLoading: false,
};

// Slice
const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all companies
      .addCase(getCompanies.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.status = "success";
        state.isLoading = false;
        state.companies = action.payload.data;
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get a company by ID
      .addCase(getCompanyById.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.status = "success";
        state.isLoading = false;
        state.viewedCompany = action.payload;
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Create a new company
      .addCase(createCompany.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.status = "success";
        state.isLoading = false;
        state.createdCompany = action.payload;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Update a company
      .addCase(updateCompany.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.status = "success";
        state.isLoading = false;
        state.updatedCompany = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Delete a company
      .addCase(deleteCompany.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.status = "success";
        state.isLoading = false;
        state.deletedCompany = action.payload;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default companySlice.reducer;

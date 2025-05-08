import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const jwt = localStorage.getItem("token");
const constructApiUrl = (params) => {
  let {
    current = 1,
    pageSize = 10,
    text = "",
    reserved = false,
    free = false,
    status = null,
    deepNumber = 4,
    user = null,
    startDate = null,
    endDate = null,
    sortBy = null,
    user_id = null,
  } = params;

  const apiUrl = new URL(
    `${process.env.REACT_APP_BACKUP_URL}vehicules`
  );
  
  return apiUrl.toString();
};

// Function to fetch data
const fetchData = async ({ url, page = 1, pageSize = 10, text = "" }) => {
  const jwt = localStorage.getItem("token");

  const params = {
    pagination: {
      page,
      pageSize
    },
    populate:["validation","type"]
  };

  if (text) {
    params.filters = {
      text: {
        $contains: text
      },
      
    };
  }

  try {
    const response = await axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

     return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


// get all vehicules
export const getVehicule = createAsyncThunk(
  "vehicule/all",
  async (parametre) => {
    const {
      pagination = {},
      text = "",
      reserved = false,
      free = false,
      status = null,
      deepNumber = 3,
      user = null,
      startDate = null,
      endDate = null,
      sortBy = null,
      user_id = null,
    } = parametre || {};

    const { current = 1, pageSize = 10 } = pagination || {};

    const apiUrl = constructApiUrl({
      current,
      pageSize,
      text,
      reserved,
      free,
      status: status,
      deepNumber,
      user,
      startDate,
      endDate,
      sortBy,
      user_id,
    });

    try {
      const data = await fetchData({
        url: apiUrl,
        page: current,
        pageSize: pageSize,
        text: text,
      });

      return { data: data, etat: free };
    } catch (error) {}
  }
);

export const getVehiculeCount = createAsyncThunk(
  "vehicule/countWaiting",
  async (parametre) => {
    const {
      pagination = {},
      text = "",
      reserved = false,
      free = false,
      status = null,
      deepNumber = 2,
      user = null,
      startDate = null,
      endDate = null,
      sortBy = null,
      user_id = null,
    } = parametre || {};
    const { current = 1, pageSize = 10 } = pagination || {};

    const apiUrl = constructApiUrl({
      current,
      pageSize,
      text,
      reserved,
      free,
      status,
      deepNumber,
      user,
      startDate,
      endDate,
      sortBy,
      user_id,
    });

    try {
      const data = await fetchData({url:apiUrl});

      return { data: data, etat: free };
    } catch (error) {}
  }
);
// get one by id
export const getVehiculeById = createAsyncThunk("vehicule/one", async (id) => {
  try {
    const jwt = localStorage.getItem("token");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}vehicules/${id}?pLevel=4`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return response?.data;
  } catch (error) {}
});
// add vehicule
export const addNewVehicule = createAsyncThunk(
  "vehicule/add",
  async (vehicule) => {
    try {
      const jwt = localStorage.getItem("token");

      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}vehicules`,
        vehicule,
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

// update vehicule

export const updateVehicule = createAsyncThunk(
  "vehicule/update",
  async ({ id, vehicule }) => {
    try {
      const jwt = localStorage.getItem("token");

      const response = await axios.put(
        `${process.env.REACT_APP_BACKUP_URL}vehicules/${id}`,
        vehicule,
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

// delete vehicule
export const deleteVehicule = createAsyncThunk(
  "vehicule/delete",
  async (id) => {
    try {
      const jwt = localStorage.getItem("token");

      const response = await axios.delete(
        `${process.env.REACT_APP_BACKUP_URL}vehicules/${id}`,
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
  vehicules: [],
  getv: null,
  status: null,
  error: null,
  isLoading: false,
  meta: [],
  count: 0,
};

export const vehiculeSlice = createSlice({
  name: "vehicules",
  initialState,
  reducers: {},
  extraReducers: {
    [getVehiculeCount.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getVehiculeCount.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;

      state.count = action?.payload?.data?.data?.length;
    },
    [getVehiculeCount.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getVehicule.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getVehicule.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.vehicules = action.payload?.data?.data;
      state.meta = action.payload?.data?.meta?.pagination;
    },
    [getVehicule.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getVehiculeById.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getVehiculeById.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.getv = action.payload;
    },
    [getVehiculeById.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [addNewVehicule.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [addNewVehicule.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
    },
    [addNewVehicule.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [updateVehicule.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [updateVehicule.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
    },
    [updateVehicule.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [deleteVehicule.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [deleteVehicule.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
    },
    [deleteVehicule.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
  },
});

export default vehiculeSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const jwt = localStorage.getItem("token");
const constructApiUrl = (params) => {
  const {
    current = 1,
    pageSize = 10,
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
  } = params;

  const apiUrl = new URL(`${process.env.REACT_APP_BACKUP_URL}vehicules`);

  // Core parameters
  apiUrl.searchParams.append("pLevel", deepNumber);
  apiUrl.searchParams.append("pagination[page]", current);
  apiUrl.searchParams.append("pagination[pageSize]", pageSize);

  // Optional filters
  if (text) {
    apiUrl.searchParams.append("filters[$or][0][mark][$containsi]", text);
    apiUrl.searchParams.append("filters[$or][1][model][$containsi]", text);
    apiUrl.searchParams.append(
      "filters[$or][2][matriculation][$containsi]",
      text
    );
  }
  console.log("statusstatus",status)
  if (status) {
    if(status==="waiting"){
      apiUrl.searchParams.append("filters[$or][0][validation][validation_state][$eq]", "waiting");
      apiUrl.searchParams.append("filters[$or][1][validation][$null]", true);
  
    }
    else 
    apiUrl.searchParams.append("filters[validation][validation_state][$eq]", status);
  }
 

  if (user_id) {
    apiUrl.searchParams.append("filters[user][id][$eq]", user_id);
  }

  if (startDate) {
    apiUrl.searchParams.append("filters[createdAt][$gte]", startDate);
  }

  if (endDate) {
    apiUrl.searchParams.append("filters[createdAt][$lte]", endDate);
  }

  if (sortBy) {
    apiUrl.searchParams.append("sort", sortBy);
  }

  return apiUrl.toString();
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
      status,
      deepNumber,
      user,
      startDate,
      endDate,
      sortBy,
      user_id,
    });

    try {
      const data = await fetchData({ url: apiUrl });
      return { data: data, etat: free };
    } catch (error) {
      console.error("Error fetching vehicules:", error);
      throw error;
    }
  }
);

// Function to fetch data
const fetchData = async ({ url, page = 1, pageSize = 10, text = "" }) => {
  const jwt = localStorage.getItem("token");

  const params = {
    pagination: {
      page,
      pageSize,
    },
    populate: ["validation", "type"],
    //  : [{ createdAt: 'desc' }],
  };

  if (text) {
    params.filters = {
      text: {
        $contains: text,
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
      const data = await fetchData({ url: apiUrl });

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
        {data:vehicule.data},
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating vehicule:", error);
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

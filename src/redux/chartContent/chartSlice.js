import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const jwt = localStorage.getItem("token");

// get all Command Count
export const getCommandCount = createAsyncThunk(
  "commandCount/all",
  async ({ companyId = null }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}commands?pLevel=1${
          companyId ? `&filters[driver][id][$eq]=${companyId}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      return response.data;
    } catch (error) {}
  }
);

// get all commands Count
export const getCommandStatusCount = createAsyncThunk(
  "commandStatus/Count",
  async ({ dateFilter = null }) => {
    let jwt = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}command/count`,
        { data: { dateFilter } },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      return response.data;
    } catch (error) {}
  }
);

// get all users Count

export const getUsersCount = createAsyncThunk("usersChart/Count", async () => {
  let jwt = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKUP_URL}users/count`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error) {}
});

// **************************** finance tab ********************************************
export const getBalance = createAsyncThunk(
  "balance/get",
  async ({ periodeFilter }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}balance`,
        {
          periodeFilter: periodeFilter,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }
);

export const getHistorique = createAsyncThunk(
  "historique/get",
  async ({ periodeFilter } = { periodeFilter: "all" }) => {
    const today = new Date();
    let startDate, endDate;

    if (periodeFilter === "week") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay()); // Start of the current week (Sunday)
      endDate = new Date(today);
      endDate.setDate(today.getDate() + (6 - today.getDay())); // End of the current week (Saturday)
    } else if (periodeFilter === "month") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the current month
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of the current month
    } else if (periodeFilter === "year") {
      startDate = new Date(today.getFullYear(), 0, 1); // Start of the current year
      endDate = new Date(today.getFullYear(), 11, 31); // End of the current year
    } else if (periodeFilter === "today") {
      startDate = new Date(today);
      endDate = new Date(today);
    } else {
      // For "all" or an unsupported value, do not apply date filtering
      startDate = new Date(0); // A date far in the past
      endDate = new Date(); // The current date
    }

    const formattedStartDate = startDate.toISOString().slice(0, 10);
    const formattedEndDate = endDate.toISOString().slice(0, 10);
    try {
      console.log(`${process.env.REACT_APP_BACKUP_URL}transactions?pLevel=3&sort=createdAt:DESC${
          periodeFilter === "all"
            ? ""
            : `&filters[$and][0][createdAt][$gte]=${formattedStartDate}&filters[$and][1][createdAt][$lte]=${formattedEndDate}`
        }`)
      const response = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}transactions?pLevel=3&sort=createdAt:DESC${
          periodeFilter === "all"
            ? ""
            : `&filters[$and][0][createdAt][$gte]=${formattedStartDate}&filters[$and][1][createdAt][$lte]=${formattedEndDate}`
        }`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting historique:", error);
      throw error;
    }
  }
);

export const addHistorique = createAsyncThunk(
  "historique/post",
  async (added) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}transactions?pLevel=3`,
        added,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      getHistorique();
      return response.data;
    } catch (error) {
      console.error("Error adding historique:", error);
      throw error;
    }
  }
);

export const deleteHistorique = createAsyncThunk(
  "historique/post",
  async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKUP_URL}transactions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting historique:", error);
      throw error;
    }
  }
);

const initialState = {
  commandCount: 0,
  clientCount: 0,
  companyCount: 0,
  driverCount: 0,
  vehiculeCount: 0,
  agentCount: 0,
  commandData: {
    pendingCount: 0,
    dispatchingCount: 0,
    canceledCount: 0,
    completedCount: 0,
  },
  status: null,
  error: null,
  isLoading: false,
  performance: null,
  historique: null,
};

export const chartSlice = createSlice({
  name: "charts",
  initialState,
  reducers: {},
  extraReducers: {
    [getCommandCount.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getCommandCount.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.commandCount = action.payload.meta?.pagination.total;
    },
    [getCommandCount.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getCommandStatusCount.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getCommandStatusCount.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.commandData = action.payload;
    },
    [getCommandStatusCount.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },

    [getUsersCount.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getUsersCount.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.commandCount = action.payload?.commandCount || 0;
      state.clientCount = action.payload?.clientCount || 0;
      state.companyCount = action.payload?.companyCount || 0;
      state.driverCount = action.payload?.driverCount || 0;
      state.agentCount = action.payload?.agentCount || 0;
      state.vehiculeCount = action.payload?.vehiculeCount || 0;
    },
    [getUsersCount.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    // [getCommandDispatchingCount.pending]: (state) => {
    //   state.status = "pending";
    //   state.isLoading = true;
    // },
    // [getCommandDispatchingCount.fulfilled]: (state, action) => {
    //   state.status = "success";
    //   state.isLoading = false;
    //   state.commandData.dispatchingCount =
    //     action.payload.meta?.pagination.total;
    // },
    // [getCommandDispatchingCount.rejected]: (state) => {
    //   state.status = "fail";
    //   state.isLoading = false;
    //   state.error = "fail";
    // },
    // [getCommandProcessingCount.pending]: (state) => {
    //   state.status = "pending";
    //   state.isLoading = true;
    // },
    // [getCommandProcessingCount.fulfilled]: (state, action) => {
    //   state.status = "success";
    //   state.isLoading = false;
    //   state.commandData.processingCount = action.payload.meta.pagination.total;
    // },
    // [getCommandProcessingCount.rejected]: (state) => {
    //   state.status = "fail";
    //   state.isLoading = false;
    //   state.error = "fail";
    // },
    // [getCommandCompletedCount.pending]: (state) => {
    //   state.status = "pending";
    //   state.isLoading = true;
    // },
    // [getCommandCompletedCount.fulfilled]: (state, action) => {
    //   state.status = "success";
    //   state.isLoading = false;
    //   state.commandData.completedCount = action.payload.meta.pagination.total;
    // },
    // [getCommandCompletedCount.rejected]: (state) => {
    //   state.status = "fail";
    //   state.isLoading = false;
    //   state.error = "fail";
    // },
    [getBalance.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getBalance.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.performance = action.payload;
    },
    [getBalance.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getHistorique.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getHistorique.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.historique = action.payload;
    },
    [getHistorique.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [addHistorique.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [addHistorique.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
    },
    [addHistorique.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [deleteHistorique.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [deleteHistorique.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
    },
    [deleteHistorique.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
  },
});

export default chartSlice.reducer;

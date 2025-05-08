import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../apolloClient";
import {
  GET_RESERVATION_BY_ID,
  GET_RESERVATIONS,
  GET_RESERVATIONS_COUNT,
  GET_COMMAND_DETAILS_BY_ID,
} from "./queries";
import {
  CREATE_RESERVATION,
  DELETE_RESERVATION,
  UPDATE_RESERVATION,
} from "./mutations";

// get one by id
export const getReservationById = createAsyncThunk(
  "reservation/get",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_RESERVATION_BY_ID,
        variables: { id },
      });
      return data.reservation;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCommandDetailsById = createAsyncThunk(
  "commandDetailsById/get",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_COMMAND_DETAILS_BY_ID,
        variables: { documentId: id },
        fetchPolicy: "network-only",
      });
      return data.command;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getReservations = createAsyncThunk(
  "reservations/all",
  async (
    {
      filters = {
        commandStatus: {
          in: ["Pending", "Canceled_by_partner", "Canceled_by_client"],
        },
      },
      pagination,
      sort = "createdAt:desc",
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await client.query({
        query: GET_RESERVATIONS,
        variables: {
          filters: {
            ...filters,
            driver: {
              documentId: {
                null: true,
              },
            },
            departDate: {
              notNull: true
            }
            
          },
          pagination,
          sort,
        },
        fetchPolicy: "network-only",
      });
      return data.commands_connection;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCommands = createAsyncThunk(
  "getCommands/all",
  async (
    { filters, pagination, sort = "createdAt:desc", currentUser },
    { rejectWithValue }
  ) => {
    let companyId;
    switch (currentUser.user_role) {
      case "agent":
        companyId = currentUser.agent_company.documentId;
        break;
      case "company": //
        companyId = currentUser.companies[0].documentId;
        break;
      default:
        companyId = undefined;
    }
    // currentUser.user_role === "agent" ? currentUser.agent_company.documentId
    // console.log("🚀 ~ user:", user)
    // console.log("🚀 ~ filters:", filters);

    try {
      const { data } = await client.query({
        query: GET_RESERVATIONS,
        variables: {
          filters: {
            ...filters,
            ...(companyId
              ? {
                  company_id: {
                    documentId: {
                      eq: companyId,
                    },
                  },
                }
              : { company_id: { documentId: { ne: null } } }),

            commandStatus: { notIn: ["Pending", "Canceled_by_client"] },
          },
          pagination,
          sort,
        },
        fetchPolicy: "network-only",
      });
      console.log("🚀 ~ data.commands:", data.commands_connection);
      return data.commands_connection;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getReservationsCount = createAsyncThunk(
  "reservations/count",
  async (params) => {
    const { filters } = params || {};

    try {
      const { data } = await client.query({
        query: GET_RESERVATIONS_COUNT,
        variables: {
          filters,
        },
        fetchPolicy: "network-only", // Ensures fresh data is fetched
      });

      return {
        count: data.commands_connection.pageInfo.total,
        // etat: free,
      };
    } catch (error) {
      console.error("Error fetching reservations count:", error);
      throw error;
    }
  }
);
// ======================================================================================>

// create reservation
export const createNewReservation = createAsyncThunk(
  "reservation/newreservation",
  async (reservation, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_RESERVATION,
        variables: { input: reservation },
      });
      return data.createReservation.reservation;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// delete reservation
export const deleteReservation = createAsyncThunk(
  "reservation/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: DELETE_RESERVATION,
        variables: { id },
      });
      return data.deleteReservation;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// update reservation
export const updateReservation = createAsyncThunk(
  "reservation/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const { data: result } = await client.mutate({
        mutation: UPDATE_RESERVATION,
        variables: { documentId: id, data },
      });
      return result.updateCommand;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  reservationsFilters: null,
  reservations: [],
  commandsFilters: null,
  commands: [],
  meta: [],
  viewedReservation: null,
  updatedReservation: null,
  deletedReservation: null,
  newReservations: null,
  viewedCommand: null,
  status: null,
  error: null,
  isLoading: false,
  count: 0,
  commandsCount: 0,
};

export const reservationSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    setReservationsFilter: (state, action) => {
      state.reservationsFilters = action.payload;
    },
    setCommandsFilter: (state, action) => {
      state.commandsFilters = action.payload;
    },
  },
  extraReducers: {
    [getReservationsCount.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getReservationsCount.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;

      state.count = action?.payload?.data?.data?.length;
    },
    [getReservationsCount.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getReservations.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getReservations.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.reservations = action.payload;

      // state.meta = action.payload?.meta?.pagination;
    },
    [getReservations.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getCommands.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getCommands.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.commands = action.payload;
      // state.meta = action.payload?.meta?.pagination;
    },
    [getCommands.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getReservationById.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getReservationById.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.viewedReservation = action.payload;
    },
    [getReservationById.rejected]: (state, action) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = action.error.message;
    },
    [getCommandDetailsById.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getCommandDetailsById.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.viewedCommand = action.payload;
    },
    [getCommandDetailsById.rejected]: (state, action) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = action.error.message;
    },

    [createNewReservation.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [createNewReservation.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;

      state.newReservations = action.payload;
    },
    [createNewReservation.failed]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [updateReservation.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [updateReservation.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.updatedReservation = action.payload;
    },
    [updateReservation.failed]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [deleteReservation.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [deleteReservation.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.deletedReservation = action.payload;
    },
    [deleteReservation.failed]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
  },
});
export const { setReservationsFilter, setCommandsFilter } =
  reservationSlice.actions;
export default reservationSlice.reducer;

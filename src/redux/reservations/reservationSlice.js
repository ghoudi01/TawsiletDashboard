import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../apolloClient";
import {
 
  GET_RESERVATIONS,
  GET_COMMAND_DETAILS_BY_ID,
} from "./queries";
import {
  CREATE_RESERVATION,
 
} from "./mutations";
import axios from "axios";

// get one by id

export const getReservationById = createAsyncThunk(
  "reservation/get",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}commands/${id}?pLevel=1`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getReservations = createAsyncThunk(
  "reservations/all",
  async (params, { rejectWithValue }) => {
    const { page = 1, pageSize = 10, text = "" ,user_id=null} = params || {};
    try {
      const jwt = localStorage.getItem("token");
      const params={
        // pLevel: 1,
         "pagination[page]": page,
         "pagination[pageSize]": pageSize,
         ...(text && {
           "filters[$or][0][clientFullName][$containsi]": text,
           "filters[$or][1][departureCity][$containsi]": text,
           "filters[$or][2][arrivalCity][$containsi]": text,
         }),
         "populate[0]":"pickUpAddress",
         "populate[1]":"dropOfAddress",
         "populate[2]":"client",
         "filters[driver][$null]":true,
         "filters[client][$notNull]":true,
       }
       if(user_id){
        params.filters["client"]["$eq"]=user_id
       } 



      const response = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}commands`,
        {
          params,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const getReservationsCount = createAsyncThunk(
  "reservations/count",
  async ({ filters } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      Object.entries(filters || {}).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([subKey, subVal]) => {
            params.append(`filters[${key}][${subKey}]`, subVal);
          });
        } else {
          params.append(`filters[${key}]`, value);
        }
      });

      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}commands?${params.toString()}`
      );

      return { count: data?.meta?.pagination?.total };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteReservation = createAsyncThunk(
  "reservation/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_BACKUP_URL}commands/${id}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateReservation = createAsyncThunk(
  "reservation/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKUP_URL}commands/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
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
export const getCommands = createAsyncThunk(
  "getCommands/all",
  async (
    { filters, Pagination, sort = "createdAt:desc", currentUser },
    { rejectWithValue }
  ) => {
    try {

      let params = {
        "pagination[page]": Pagination.page,
        "pagination[pageSize]": Pagination.pageSize,
        "populate[0]":"pickUpAddress",
        "populate[1]":"dropOfAddress",
        "populate[2]":"client",
        "filters[driver][$notNull]":true,
        "filters[client][$notNull]":true,
      }
   
      if(filters.commandStatus.in){
        filters.commandStatus.in.forEach(status => {
          console.log("status",status)
          params["filters[commandStatus][$in]"] = status
        })
      }
      else {
        
      }
      // if(filters.commandStatus){
      //   params.filters["commandStatus"] = filters.commandStatus
      // }
      const jwt = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}commands`,
        {
          params,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching commands:", error);
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

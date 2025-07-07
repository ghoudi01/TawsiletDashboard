import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import client from "../../apolloClient";
import { GET_COMMANDS } from "./queries";

// get one by id
export const getReservationById = createAsyncThunk(
  "reservation/get",
  async (id) => {
    try {
      const jwt = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}commands/${id}?pLevel`,
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
 
const constructApiUrl = ({
  current = 1,
  pageSize = 10,
  text = null,
  reserved = false,
  free = false,
  status = null,
  deepNumber = 4,
  user = null,
  startDate = null,
  endDate = null,
  sortBy = null,
  user_id = null,
}) => {
  const apiUrl = new URL(`${process.env.REACT_APP_BACKUP_URL}commands`);
  //
  apiUrl.searchParams.append("pLevel", `${deepNumber}`);
  //
  apiUrl.searchParams.append("pagination[pageSize]", pageSize);
  //
  apiUrl.searchParams.append("pagination[page]", current);
  //
  if (sortBy) {
    apiUrl.searchParams.append("sort[0]", sortBy);
  }

  if (user) {
    apiUrl.searchParams.append("filters[company_id][id][$eq]", user);
  }
  //
  if (reserved) {
    apiUrl.searchParams.append("filters[company_id][id][$notNull]", reserved);
  }

  //
  if (free) {
    apiUrl.searchParams.append("filters[company_id][id][$null]", free);
  }
  //
  // apiUrl.searchParams.append("filters[company_id][id][$null]", true);
  //
  if (status) {
    apiUrl.searchParams.append("filters[commandStatus][$eq]", status);
  }
  //

  apiUrl.searchParams.append(
    "filters[$or][0][pickUpAddress][Address][$contains]",
    text
  );

  //
  apiUrl.searchParams.append(
    "filters[$or][1][dropOfAddress][Address][$contains]",
    text
  );
  if (startDate) {
    apiUrl.searchParams.append("filters[$and][0][departDate][$gte]", startDate);
  }
  if (endDate) {
    apiUrl.searchParams.append("filters[$and][1][departDate][$lte]", endDate);
  }
  if (user_id) {
    apiUrl.searchParams.append("filters[$and][0][client_id][id][$eq]", user_id);
  }

  //${process.env.REACT_APP_BACKUP_URL}commands?filters[departDate][$gte][0]=2023-07-14&filters[departDate][$lte][1]=2023-07-20
  // apiUrl.searchParams.append("sort", ":desc");
  return apiUrl.toString();
};

// Function to fetch data
const fetchData = async (url) => {
  try {
    const jwt = localStorage.getItem("token");

    const response = await axios.get(url, {
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

export const getReservations = createAsyncThunk("reservations/all", async () => {
  const { data } = await client.query({ query: GET_COMMANDS });
  return data.items;
});
// Export the async thunk with improved readability and reusability
// export const getReservations = createAsyncThunk(
//   "reservations/all",
//   async (parametre) => {
//     const {
//       pagination = {},
//       text = "",
//       reserved = false,
//       free = false,
//       status = null,
//       deepNumber = 4,
//       user = null,
//       startDate = null,
//       endDate = null,
//       sortBy = null,
//       user_id = null,
//     } = parametre || {};
//     const { current = 1, pageSize = 10 } = pagination || {};

//     const apiUrl = constructApiUrl({
//       current,
//       pageSize,
//       text,
//       reserved,
//       free,
//       status,
//       deepNumber,
//       user,
//       startDate,
//       endDate,
//       sortBy,
//       user_id,
//     });

//     try {
//       const data = await fetchData(apiUrl);

//       return { data: data, etat: reserved };
//     } catch (error) {}
//   }
// );
export const getReservationsCount = createAsyncThunk(
  "reservations/count",
  async (parametre) => {
    const {
      pagination = {},
      text = "",
      reserved = false,
      free = false,
      status = null,
      deepNumber = 1,
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
      const data = await fetchData(apiUrl);

      return { data: data, etat: free };
    } catch (error) {}
  }
);
// ======================================================================================>

// create reservation
export const createNewReservation = createAsyncThunk(
  "reservation/newreservation",
  async (reservation) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}commands`,

        reservation,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
// delete reservation
export const deleteReservation = createAsyncThunk(
  "reservation/delete",
  async (id) => {
    try {
      const jwt = localStorage.getItem("token");

      const response = await axios.delete(
        `${process.env.REACT_APP_BACKUP_URL}commands/${id}`,
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
// update reservation
export const updateReservation = createAsyncThunk(
  "reservation/update",
  async ({ id, body }) => {
    try {
      const jwt = localStorage.getItem("token");

      const response = await axios.put(
        `${process.env.REACT_APP_BACKUP_URL}commands/${id}`,
        body,
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
  reservations: [],
  commandes: [],
  meta: [],
  viewedReservation: null,
  updatedReservation: null,
  deletedReservation: null,
  newReservations: null,
  status: null,
  error: null,
  isLoading: false,
  filter: "",
  count: 0,
  commandeCount: 0,
};

export const reservationSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
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
      if (action.payload?.etat) {
        state.commandes = action.payload?.data?.data;
      } else state.reservations = action.payload?.data?.data;

      state.meta = action.payload?.data?.meta?.pagination;
    },
    [getReservations.rejected]: (state) => {
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
export const { setFilter } = reservationSlice.actions;
export default reservationSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunks
export const getTickets = createAsyncThunk(
  "tickets/getTickets",
  async ({ user_role, page, pageSize, text }) => {
    console.log("🚀 ~ user_role:", user_role)
    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}tickets?populate=*&filters[user][user_role][$eq]=${user_role}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );
    console.log(response, "tickets data !!!!!!!!!!!!!!!!!!!!!");
    return response.data;
  }
);
export const getTicketById = createAsyncThunk(
  "tickets/getTicketById",
  async (id) => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}tickets/${id}?populate=*`
    );
    return response.data;
  }
);
export const addTicket = createAsyncThunk(
  "tickets/addTicket",
  async (ticket) => {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKUP_URL}tickets`,
      ticket
    );

    return response.data;
  }
);

export const updateTicket = createAsyncThunk(
  "tickets/updateTicket",
  async ({ id, ...ticket }) => {
    const response = await axios.put(
      `${process.env.REACT_APP_BACKUP_URL}tickets/${id}`,
      { data: ticket }
    );
    return response.data;
  }
);

// Slice
const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    tickets: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Tickets
      .addCase(getTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tickets = action.payload;
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getTicketById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTicketById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentTicket = action.payload; // Store the fetched ticket in currentTicket
      })
      .addCase(getTicketById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add Ticket
      .addCase(addTicket.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tickets.push(action.payload);
      })
      .addCase(addTicket.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Update Ticket
      .addCase(updateTicket.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.status = "succeeded";
        // const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        // if (index !== -1) {
        //   state.tickets[index] = action.payload;
        // }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default ticketSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const jwt = localStorage.getItem("token");
export const getNotification = createAsyncThunk(
  "notification/get",
  async ({ id }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}notifications?sort=createdAt:desc&filters[sendTo][documentId][$eq]=${id}&populate=*`,
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

export const isReadNotification = createAsyncThunk(
  "notification/read",
  async (id) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKUP_URL}notifications/${id}`,
        {
          data: {
            isRead: true,
          },
        },
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
export const sendNotification = createAsyncThunk(
  "notification/send",
  async (body) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}notify-user`,
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
  notifications: [],
  status: "",
  error: null,
  trigerNotifications: false,
};

export const notificationSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    trigerNotificationsReducer: (state) => {
      return { ...state, trigerNotifications: !state.trigerNotifications };
    },
  },
  extraReducers: {
    [getNotification.pending]: (state) => {
      state.status = "pending";
    },
    [getNotification.fulfilled]: (state, action) => {
      state.status = "success";
      state.notifications = action.payload;
    },
    [getNotification.rejected]: (state) => {
      state.status = "fail";
      state.error = "fail";
    },
    [isReadNotification.pending]: (state) => {
      state.status = "pending";
    },
    [isReadNotification.fulfilled]: (state, action) => {
      state.status = "success";
    },
    [isReadNotification.rejected]: (state) => {
      state.status = "fail";
      state.error = "fail";
    },
    [sendNotification.pending]: (state) => {
      state.status = "pending";
    },
    [sendNotification.fulfilled]: (state, action) => {
      state.status = "success";
    },
    [sendNotification.rejected]: (state) => {
      state.status = "fail";
      state.error = "fail";
    },
  },
});

export const { trigerNotificationsReducer } = notificationSlice.actions;

export default notificationSlice.reducer;

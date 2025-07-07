import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { message } from "antd";
import OneSignal from "react-onesignal";
import client from "../../apolloClient";
import {
  GET_CLIENTS,
  GET_COMPANIES_LIST,
  GET_COMPANY_DETAILS_BY_ID,
  GET_VEHICULES_LIST,
} from "./queries";

const constructApiUrl = ({
  current = 1,
  pageSize = 10,
  text = null,
  status = null,
  deepNumber = 4,
  user = null,
  startDate = null,
  endDate = null,
  sortBy = null,
  user_id = null,
}) => {
  const apiUrl = new URL(
    `${process.env.REACT_APP_BACKUP_URL}users?filters[user_role][$eq]=company`
  );
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

  //

  if (status) {
    apiUrl.searchParams.append(
      "filters[validation][validation_state][$eq]",
      status
    );
  }
  //

  apiUrl.searchParams.append("filters[$or][0][username][$contains]", text);

  //
  apiUrl.searchParams.append(
    "filters[$or][1][accountOverview][name][$contains]",
    text
  );

  //${process.env.REACT_APP_BACKUP_URL}commands?filters[departDate][$gte][0]=2023-07-14&filters[departDate][$lte][1]=2023-07-20
  // apiUrl.searchParams.append("sort", ":desc");
  return apiUrl.toString();
};
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
// export const getCompaniesOld = createAsyncThunk(
//   "companies/all",
//   async (params) => {
//     const { page = 1, pageSize = 10, text = "", status = "" } = params;
//     try {
//       const jwt = localStorage.getItem("token");

//       const response = await axios.post(
//         `${process.env.REACT_APP_BACKUP_URL}usersbyrole/company`,
//         { page: page, pageSize: pageSize, text: text, status: status },
//         {
//           headers: {
//             Authorization: `Bearer ${jwt}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   }
// );

export const getCompanies = createAsyncThunk(
  "companies/all",
  async (params) => {
    const { page = 1, pageSize = 10, text = "", status = "" } = params;
    try {
      const { data } = await client.query({
        query: GET_COMPANIES_LIST,
        variables: {
          filters: null,
          pagination: { page: page, pageSize: pageSize },
          // status: status,
          sort: null,
        },
      });
      return data.companies_connection;
    } catch (error) {
      throw error;
    }
  }
);

export const getCompanyById = createAsyncThunk(
  "user/company/id",
  async (params) => {
    const { id } = params;
    try {
      const { data } = await client.query({
        query: GET_COMPANY_DETAILS_BY_ID,
        variables: {
          documentId: id,
        },
      });
      return data.company;
    } catch (error) {
      throw error;
    }
  }
);

export const getCompaniesCount = createAsyncThunk(
  "companies/companyWaitingCount",
  async () => {
    try {
      const jwt = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}users?pLevel=3&filters[$and][0][user_role][$eq]=company&filters[validation][validation_state][$eq]=waiting`,
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

// get one by id
export const getUserById = createAsyncThunk("user/get", async (id) => {
  try {
    const jwt = localStorage.getItem("token");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}users/${id}?pLevel=4`,
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
});

//get drivers

export const getDriver = createAsyncThunk("drivers/all", async (params) => {
  const { page = 1, pageSize = 10, text = "",status="" } = params;
  
  try {
    const jwt = localStorage.getItem("token");
    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}usersbyrole/driver`,
      {
        params: {
          page: page,
          pageSize: pageSize,
          text: text,
          status
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting drivers:", error);
    throw error;
  }
});

export const getDriverById = createAsyncThunk("driver/byId", async (params) => {
  const { page = 1, pageSize = 10, text = "", id } = params;
  try {
    const jwt = localStorage.getItem("token");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}users/${id}?populate=*`,
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
});

export const getMapDriver = createAsyncThunk(
  "drivers/map/all",
  async (params) => {
    const { text = "" } = params;
    try {
      const jwt = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}usersbyrole/driverslocation`,
        { text: text },
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

export const getDriverCount = createAsyncThunk(
  "drivers/waitinDriverCount",
  async () => {
    try {
      const jwt = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}users?pLevel=3&filters[$and][0][user_role][$eq]=driver&filters[validation][validation_state][$eq]=waiting`,
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
export const getAdmins = createAsyncThunk("admins/all", async (params) => {
  const { page = 1, pageSize = 10, text = "" } = params;
  try {
    const jwt = localStorage.getItem("token");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}users`,
      {
        params: {
          "filters[user_role][$eq]": "admin",
          "pagination[page]": page,
          "pagination[pageSize]": pageSize,
          ...(text && {
            // Add name, email, or any other field filter dynamically
            "filters[$or][0][firstName][$containsi]": text,
            "filters[$or][1][lastName][$containsi]": text,
            "filters[$or][2][email][$containsi]": text,
          }),
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
});

export const getAgent = createAsyncThunk("agent/all", async (params) => {
  const { page = 1, pageSize = 10, text = "" } = params;
  try {
    const jwt = localStorage.getItem("token");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}users`,
      {
        params: {
          "filters[user_role][$startsWith]": "agent",
          "pagination[page]": page,
          "pagination[pageSize]": pageSize,
          ...(text && {
            // Add name, email, or any other field filter dynamically
            "filters[$or][0][firstName][$containsi]": text,
            "filters[$or][1][lastName][$containsi]": text,
            "filters[$or][2][email][$containsi]": text,
          }),
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
});
export const getusers = createAsyncThunk("user/all", async () => {
  try {
    const jwt = localStorage.getItem("token");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}users?pLevel=1`,

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
});
export const getCars = createAsyncThunk("cars/all", async () => {
  try {
    const jwt = localStorage.getItem("token");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}vehicules?populate=*`,

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
});

export const getClients = createAsyncThunk("clients/all", async (params) => {
  const { page = 1, pageSize = 10, text = "" } = params;
  try {
    const jwt = localStorage.getItem("token");
  
    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}usersbyrole/client`,
      {
        params: {
          page: page,
          pageSize: pageSize,
          text: text,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
});
export const getCommands = createAsyncThunk(
  "commands/all",
  async ({ page = 1, pageSize = 100 }) => {
    try {
      const jwt = localStorage.getItem("token");

      // Requesting data with dynamic `page` and `pageSize`
      const response = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}commands?pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
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

export const getusersTwoDeep = createAsyncThunk("user/allTwoDeep", async () => {
  try {
    const jwt = localStorage.getItem("token");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}users?populate=company_id`,
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
});

//forget password

export const forgetPassword = createAsyncThunk(
  "user/forgetPassword",
  async (data) => {
    try {
      // const response = await axios.get(
      //   `${process.env.REACT_APP_BACKUP_URL}/api/users?filters[$and][0][email][$eq]=${data.email}`
      // );

      // if (response.data.length) {
      return axios
        .post(`${process.env.REACT_APP_BACKUP_URL}auth/forgot-password`, data)
        .then((ress) => {
          return ress.data;
        });
      // } else {
      //   return {
      //     ok: false,
      //   };
      // }

      // return response;
    } catch (error) {}
  }
);
// Update password

export const changePassword = createAsyncThunk(
  "user/changepassword",
  async (credentials) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}auth/change-password`,
        credentials,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("token", response.data.jwt);
      // if (response.data.user.user_role === "admin") {
      //   window.location.href = "/admin/dashboard";
      // } else {
      //   window.location.href = "/clientprofile/details";
      // }

      return response.data.user;
    } catch (error) {
      // console.error("CHange password error:", error);
      // return error;
      alert("Combinaison incorrecte");
      throw error;
    }
  }
);

// login
export const loginUserTodash = createAsyncThunk(
  "user/loginDash",
  async (credentials) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}auth/local`,
        credentials
      );
      if (
        response?.data?.user?.user_role === "owner" ||
        response?.data?.user?.user_role === "agent" ||
        response?.data?.user?.user_role === "admin" ||
        (response?.data?.user?.user_role === "driver" &&
          response?.data?.user?.pro) ||
        response?.data?.user?.user_role === "company"
      ) {
        localStorage.setItem("token", response.data.jwt);
        OneSignal.login(String(response.data.user.documentId));

        return response.data.user;
      } else
        return alert(
          "vous n'êtes pas autorisé à acceder au dashboard Tawsilet!"
        );
    } catch (error) {
      console.error("Login error:", error);
      // alert("Identifiant ou mot de passe incorrect");
      message.error(`Identifiant ou mot de passe incorrect`);
      throw error;
    }
  }
);
// get current user
export const getCurrentUser = createAsyncThunk("user/current", async () => {
  try {
    const jwt = localStorage.getItem("token");
    if (jwt) {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}users/me?pLevel=3`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      return response.data;
    }
  } catch (error) {
    console.error("current user error:", error);
    throw error;
  }
});
export const getDriversWithCars = createAsyncThunk(
  "user/getDriversWithCars",
  async () => {
    try {
      const jwt = localStorage.getItem("token");
      if (jwt) {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKUP_URL}users?pLevel=3`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        return response.data;
      }
    } catch (error) {
      console.error("current user error:", error);
      throw error;
    }
  }
);

export const updateDriver = createAsyncThunk(
  "driver/update",
  async ({ id, isFree }, { rejectWithValue }) => {
 
    try {
      const jwt = localStorage.getItem("token");
      if (!jwt) {
        throw new Error("Authentication token is missing.");
      }

      // Fetch driver details
      const driverResponse = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}users?filters[documentId]=${id}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
    
      const updateResponse = await axios.put(
        `${process.env.REACT_APP_BACKUP_URL}users/${driverResponse.data?.[0]?.id}`,
        { data: { isFree: isFree } },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      return updateResponse.data; // Return updated driver data
    } catch (error) {
      console.error("Error updating driver:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateDriverValidation = createAsyncThunk(
  "driver/updateValidation",
  async ({ id, validation }, { rejectWithValue }) => {
    try {
      const jwt = localStorage.getItem("token");
      if (!jwt) {
        throw new Error("Authentication token is missing.");
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BACKUP_URL}driver/${id}/validation`,
        { validation },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating driver validation:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async ({ id, user }) => {
    try {
      const jwt = localStorage.getItem("token");
  

      const response = await axios.put(
        `${process.env.REACT_APP_BACKUP_URL}users/${id}?pLevel=4`,
        user,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
     
      if (response.data) {
        return response.data;
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      // Handle errors here
      console.error("Error updating user:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  }
);
/* export const assigneVehicule = createAsyncThunk(
  "user/assigneVehicule",
  async ({ id, user }) => {
    try {
      const jwt = localStorage.getItem("token");

      const response = await axios.put(
        `${process.env.REACT_APP_BACKUP_URL}users/${id}?pLevel=4`,
        user,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      // Check if the response contains a valid data object
      if (response.data) {
        return response.data;
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      // Handle errors here
      console.error("Error updating user:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  }
); */
// delete user

export const usersDel = createAsyncThunk("user/delete", async (id) => {
  try {
    const jwt = localStorage.getItem("token");

    let response = axios.delete(
      `${process.env.REACT_APP_BACKUP_URL}users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error) {}
});

export const getCompanyList = createAsyncThunk("companyList/all", async () => {
  try {
    const jwt = localStorage.getItem("token");

    const response = await axios.post(
      `${process.env.REACT_APP_BACKUP_URL}userslist/company`,
      {},
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
});

export const getValidCompanyList = createAsyncThunk(
  "companyList/all",
  async () => {
    try {
      const jwt = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}userslist/valid-company`,
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

export const getDriverList = createAsyncThunk(
  "driverList/all",
  async (params) => {
    const { companyId = null } = params;
    try {
      const jwt = localStorage.getItem("token");

      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}userslist/driver`,
        { companyId: companyId },
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
export const getVehiculeList = createAsyncThunk(
  "vehiculelist/all",
  async (params) => {
    let { companyId = null } = params;
    try {
      const jwt = localStorage.getItem("token");

      const { data } = await client.query({
        query: GET_VEHICULES_LIST,
       
      });
      return data.vehicules;
    } catch (error) {
      throw error;
    }
  }
);

export const getUsersByVehiculeId = createAsyncThunk(
  "user/byVehiculeId",
  async (vehiculeId) => {
    try {
      const jwt = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}users?filters[vehicules][id][$eq]=${vehiculeId}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  driversPagination: null,
  clientPagination: null,
  driversWithCars: null,
  getted: null,
  pagination: {
    page: 1,
    pageSize: 100,
    totalPages: 0,
    totalItems: 0,
  },
  users: [],
  clients: [],
  commands: [],
  commandsCount: null,
  companies: [],
  drivers: [],
  mapDrivers: [],
  driverList: [],
  selectedDriver: null,
  agents: [],
  admins: [],
  companyList: [],
  validCompanyList: [],
  vehiculeList: [],
  currentUser: null,
  updatedUser: null,
  newUser: null,
  meta: [],
  status: null,
  error: null,
  isLoading: false,
  usersUnDeep: [],
  filter: null,
  isAuth: false,
  count: 0,
  countCompany: 0,
  reviews: [],
  cars: [],
  currentCompany: null,
};

//register user

export const registerUser = createAsyncThunk(
  "user/register",
  async (credentials) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}auth/local/register`,
        credentials
      );
    

      return response.data.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
);

export const registerAdmin = createAsyncThunk(
  "user/register",
  async (credentials) => {
    try {
      const jwt = localStorage.getItem("token");

      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}register/driver`,
        credentials,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      return response.data.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
);

export const registerAgent = createAsyncThunk(
  "user/register",
  async (credentials) => {
    try {
      const jwt = localStorage.getItem("token");

      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}register/agent`,
        credentials,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      return response.data.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
);

export const registerDriver = createAsyncThunk(
  "user/register",
  async (credentials) => {
    try {
      const jwt = localStorage.getItem("token");

      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}register/driver`,
        credentials,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      return response.data.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
);

//get reviews ----------

export const getReviews = createAsyncThunk("reservation/all", async () => {
  try {
    const jwt = localStorage.getItem("token");

    const response = await axios.get(
      `${process.env.REACT_APP_BACKUP_URL}reviews?pLevel=3`,
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
});

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state, action) => {
      state.currentUser = null;
      state.isAuth = false;
      localStorage.removeItem("token");
    },

    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: {
    [getReviews.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getReviews.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.reviews = action.payload.data;
    },
    [getReviews.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getCompaniesCount.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getCompaniesCount.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.countCompany = action.payload.length;
    },
    [getCompaniesCount.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getCompanyById.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getCompanyById.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.currentCompany = action.payload;
    },
    [getCompanyById.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },

    [getDriverCount.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getDriverCount.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.count = action.payload.length;
    },
    [getDriverCount.rejected]: (state) => {
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
      state.commands = action.payload.data;
      state.commandsCount = action.payload.meta;
      state.pagination = action.payload.meta;
    },
    [getCommands.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },

    [getDriverById.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getDriverById.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.selectedDriver = action.payload;
      // state.meta = action.payload;
    },
    [getDriverById.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getDriver.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getDriver.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.drivers = action.payload;
      state.driversPagination = action.payload.pagination;
      // state.meta = action.payload; clientPagination
    },
    [getDriver.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getMapDriver.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getMapDriver.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.mapDrivers = action.payload;
      // state.meta = action.payload;
    },
    [getMapDriver.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getCars.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getCars.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.cars = action.payload;
      // state.meta = action.payload;
    },
    [getCars.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },

    [getAgent.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getAgent.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.agents = action.payload;
      // state.meta = action.payload;
    },
    [getAgent.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getAdmins.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getAdmins.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.admins = action.payload;
      // state.meta = action.payload;
    },
    [getAdmins.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getCompanies.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getCompanies.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.companies = action.payload;
      state.meta = action.payload.pageInfo;
    },
    [getCompanies.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },

    [getCompanyList.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getCompanyList.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.companyList = action.payload;
    },
    [getCompanyList.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getValidCompanyList.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getValidCompanyList.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.validCompanyList = action.payload;
    },
    [getValidCompanyList.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },

    [getDriverList.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getDriverList.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.driverList = action.payload;
    },
    [getDriverList.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [getVehiculeList.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getVehiculeList.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.vehiculeList = action.payload;
    },
    [getVehiculeList.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [forgetPassword.pending]: (state) => {
      state.status = "pending";
      // state.isLoading = true;
    },
    [forgetPassword.fulfilled]: (state, action) => {
      state.status = "success";
      // state.currentUser = action.payload;
      // state.isLoading = false;
    },
    [forgetPassword.rejected]: (state) => {
      state.status = "fail";
      // state.isLoading = false;
    },

    [changePassword.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [changePassword.fulfilled]: (state, action) => {
      state.status = "success";
      // state.currentUser = action.payload;
      state.isLoading = false;
    },
    [changePassword.rejected]: (state, action) => {
      state.status = "fail";
      state.isLoading = false;
    
    },

    [getClients.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getClients.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.clients = action.payload;
      state.clientPagination = action.payload.pagination;
    },
    [getClients.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },

    [getusersTwoDeep.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getusersTwoDeep.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
      state.usersUnDeep = action.payload;
    },
    [getusersTwoDeep.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },

    [getUserById.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getUserById.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;

      state.getted = action.payload;
    },
    [getUserById.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.error = "fail";
    },
    [loginUserTodash.pending]: (state) => {
      state.status = "pending";
      state.isAuth = false;
      state.isLoading = true;
    },
    [loginUserTodash.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;

      state.isAuth = true;

      // state.currentUser = action.payload;
    },
    [loginUserTodash.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      state.isAuth = false;
      state.error = "fail";
    },
    [getCurrentUser.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getCurrentUser.fulfilled]: (state, action) => {
      state.status = "success";
      state.currentUser = action.payload;
      state.isLoading = false;
    },
    [getCurrentUser.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
    },
    [getDriversWithCars.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [getDriversWithCars.fulfilled]: (state, action) => {
      state.status = "success";
      state.driversWithCars = action.payload;
      state.isLoading = false;
    },
    [getDriversWithCars.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
    },
    [updateUser.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.status = "success";
  state.updatedUser = action.payload;
  state.isLoading = false;

  // 🛠️ Update the specific user in drivers.results
  const updatedUser = action.payload;
   if(updatedUser.user_role==="driver"){
   const   index =  state.drivers?.results?.findIndex((u) => u.id === updatedUser.id);
   if (index !== -1) {
    state.drivers.results[index] = updatedUser;
  }

  }
  if(updatedUser.user_role==="client"){
    const   index =  state.clients?.results?.findIndex((u) => u.id === updatedUser.id);
   if (index !== -1) {
    state.clients.results[index] = updatedUser;
 }
}
 
    },
    [updateUser.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
    },
    [updateDriver.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [updateDriver.fulfilled]: (state, action) => {
      state.status = "success";
      state.updatedUser = action.payload;
      state.isLoading = false;
    },
    [updateDriver.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
    },
    [updateDriverValidation.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [updateDriverValidation.fulfilled]: (state, action) => {
      state.status = "success";
      state.isLoading = false;
 
      if (action.payload.user_role==="driver") {
       const index= state.drivers.results.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.drivers.results[index] = action.payload;
        }

      }
     
        if (action.payload.user_role==="client") {
          const index= state.clients.results.findIndex(
            (user) => user.id === action.payload.id
          );
          if (index !== -1) {
            state.clients.results[index] = action.payload;
          }
        
      }
     
    },
    [updateDriverValidation.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
    },
    [usersDel.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [usersDel.fulfilled]: (state, action) => {
      state.status = "success";
      state.users = action.payload;
      state.isLoading = false;
    },
    [usersDel.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
    },

    [registerUser.pending]: (state) => {
      state.status = "pending";
      state.isLoading = true;
    },
    [registerUser.fulfilled]: (state, action) => {
      state.status = "success";
      state.newUser = action.payload;
      state.isLoading = false;
    },
    [registerUser.rejected]: (state) => {
      state.status = "fail";
      state.isLoading = false;
      alert("Username or email already taken.");
    },
  },
});
export const { setFilter, logout } = userSlice.actions;
export default userSlice.reducer;

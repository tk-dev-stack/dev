


import { createSlice,  } from "@reduxjs/toolkit";
import { fetchData } from "./api.actions";

interface ApiData {
  key: string;
  value: string;
  type: string;
}

interface ApiState {
  data: ApiData[];
  loading: boolean;
  error: string | null;
}

const initialState: ApiState = {
  data: [],
  loading: false,
  error: null,
};



const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    clearApiData: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

// Export actions and reducer
export const { clearApiData } = apiSlice.actions;
export default apiSlice.reducer;

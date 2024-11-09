import { createSlice } from "@reduxjs/toolkit";
import { fetchDropDownOption } from "./dropdown.actions";

interface OptionsData {
  key: string;
  value: string;
 
}

interface OptionsState {
  data: OptionsData[];
  loading: boolean;
  error: string | null;
}
const initialState: OptionsState = {
  data: [],
  loading: false,
  error: null,
};

const dropDownOptionSlice = createSlice({
  name: "dropDownOptions",
  initialState,
  reducers: {
    clearOptionsData: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDropDownOption.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDropDownOption.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDropDownOption.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

// Export actions and reducer
export const { clearOptionsData } = dropDownOptionSlice.actions;
export default dropDownOptionSlice.reducer;

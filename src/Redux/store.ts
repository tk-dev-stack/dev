

import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import dashboardReducer from "./Dashboard/dashboard.reducer";
import apiReducer from "./Apislice/api.reducer"; // Update the import path
import dropDownReducer from './FormComponents/DropDown/dropdown.reducer'
const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  api: apiReducer,
  dropDownReducer: dropDownReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

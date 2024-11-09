import store from "src/Redux/store";
const darktheme = `
.darkTheme {
  background-color: #1a1a1a; 
  color: white;

  .ant-input {
    background-color: #333; 
    color: white; 
  }

  .ant-form-item-label > label {
    color: white;
  }
}`;

const lighttheme = `.lightTheme {
  background-color: white; 
  color: black; 

  .ant-input {
    background-color: #fff; // White background for input fields
    color: black; 
  }

  .ant-form-item-label > label {
    color: black; 
  }
}`;
export const setWidgetTheme = () => {
  const state = store.getState();
  const darkMode = state.dashboard.fieldData.darkMode;
  console.log("darkmode", darkMode);

  return darkMode ? darktheme : lighttheme;
};

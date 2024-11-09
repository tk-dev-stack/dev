import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { Provider } from "react-redux";
import store from "./Redux/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      {/* <ConfigProvider
        theme={{
          components: {},
          token: {
            borderRadius: 20,
            colorPrimary: "#139696",
          },
        }}
      > */}
      <App />
      {/* </ConfigProvider> */}
    </Provider>
  </StrictMode>
);

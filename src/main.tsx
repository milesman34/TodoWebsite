import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import { Root } from "./pages/root";
import { setupStore } from "./utils/storageTools";

// Set up the store with loaded data from localStorage + sessionStorage
const store = setupStore();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <Root />
        </Provider>
    </StrictMode>
);

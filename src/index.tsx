import { StrictMode } from "react";
import { render } from "react-dom";

import App from "./components/App/App";

import "./index.scss";

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);

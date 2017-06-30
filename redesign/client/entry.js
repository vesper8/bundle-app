import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/root";
import configureStore from "./store/store";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  const store = configureStore();

  ReactDOM.render(<Root store={store} />, root);

  if (module.hot) {
    module.hot.accept("./components/root", () => {
      /*eslint-disable no-unused-vars*/
      const NextApp = require("./components/root").default;
      /*eslint-enable no-unused-vars*/

      ReactDOM.render(<Root store={store} />, root);
    });
  }
});

import _$ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import { MemoryRouter } from "react-router-dom";
import ReactTestUtils from "react-dom/test-utils";
import { JSDOM } from "jsdom";
import chai, { expect } from "chai";
import chaiJquery from "chai-jquery";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers/root_reducer";

const dom = new JSDOM("<!doctype html><html><body></body></html>");
global.window = dom.window;
global.document = window.document;
global.navigator = window.navigator;
const $ = _$(window);
const store = createStore(rootReducer);

chaiJquery(chai, chai.util, $);

function getComponentInstance(ComponentClass, props = {}, state = {}) {
  const mockStore = createStore(rootReducer, state, applyMiddleware(thunk));
  const componentInstance = ReactTestUtils.renderIntoDocument(
    <Provider store={mockStore}>
      <MemoryRouter>
        <ComponentClass {...props} />
      </MemoryRouter>
    </Provider>
  );

  return componentInstance;
}

function renderComponent(ComponentClass, props = {}, state = {}) {
  const componentInstance = getComponentInstance(ComponentClass, props, state);
  return $(ReactDOM.findDOMNode(componentInstance));
}

function renderAndUnmountComponent(ComponentClass, props = {}, state = {}) {
  const container = document.createElement("div");
  const mockStore = createStore(rootReducer, state, applyMiddleware(thunk));
  ReactDOM.render(
    <Provider store={mockStore}>
      <MemoryRouter>
        <ComponentClass {...props} />
      </MemoryRouter>
    </Provider>,
    container
  );
  ReactDOM.unmountComponentAtNode(container);
}

$.fn.simulate = function(eventName, value) {
  if (value) {
    this.val(value);
  }
  ReactTestUtils.Simulate[eventName](this[0]);
};

export { renderComponent, renderAndUnmountComponent, expect, store };

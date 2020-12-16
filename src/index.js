// import module
import React from 'react';
import ReactDOM from 'react-dom';

// import style
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import App from './App';


// import browserRouter
import { BrowserRouter } from 'react-router-dom';

// import create Store for react redux
import { createStore } from "redux"

// NOTE import provider
import { Provider } from "react-redux"

// NOTE import combined reducers
import allReducers from "./reducer"

// NOTE make variable for create store
let globalState = createStore(allReducers)

// NOTE subscribe variable global state for console.log each time there is an update of redux
globalState.subscribe(() => console.log("Global State : ", globalState.getState()))




ReactDOM.render(
  <Provider store={globalState}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

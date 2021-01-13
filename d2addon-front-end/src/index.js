import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import NavBar from './modules/common/navbar'
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';  /*import necessary for dropdown to work*/
import Login from './modules/user/login/index.js';

ReactDOM.render(
  <React.StrictMode>
    <NavBar />
    <Login />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

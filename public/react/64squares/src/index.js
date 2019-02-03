import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Landing from './containers/Landing';
import {  BrowserRouter as Router } from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import configureStore from './configureStore';


const store = configureStore();

ReactDOM.render(<Provider store={store}><Router><Landing /></Router></Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

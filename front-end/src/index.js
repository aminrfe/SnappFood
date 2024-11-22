import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@fontsource/vazir';
import reportWebVitals from './reportWebVitals';
import { createTheme } from '@mui/material/styles';

document.documentElement.lang = "fa";
document.documentElement.dir = "rtl";

const theme = createTheme({
  direction: 'rtl',
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import { hot } from 'react-hot-loader/root'; // Import the 'hot' function
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const HotApp = hot(App); // Wrap your root component with the 'hot' function

ReactDOM.render(
  <React.StrictMode>
    <HotApp /> {/* Render the wrapped component */}
  </React.StrictMode>,
  document.getElementById('root')
);


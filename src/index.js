import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Browse from './browse';
import Create from './create';
import Manage from './manage';
import PolygonID from './polygonID';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

<div className="App-header">

<BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />

    <Route path="/browse" element={<Browse />} />
    <Route path="/create" element={<Create/>} />
    <Route path="/manage" element={<Manage />} />
    <Route path="/polygonID" element={<PolygonID />} />

  </Routes>
</BrowserRouter>


</div>

   
  </React.StrictMode>
);



import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import Layout from './pages/Layout';
import ViewBag from './pages/ViewBag';
import Cart from './pages/Cart';
import { client } from "@tilework/opus";

client.setEndpoint('http://localhost:4000/')
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path=":productId" element={<ProductPage />} />
          <Route path="viewbag" element={<ViewBag />} />
          <Route path="cart" element={<Cart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode> 
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

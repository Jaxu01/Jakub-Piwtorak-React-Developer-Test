import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Navigate, Route } from "react-router-dom"
import './index.css'
import reportWebVitals from './reportWebVitals'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Layout from './pages/Layout'
import Cart from './pages/Cart'
import { client } from "@tilework/opus"

client.setEndpoint('http://localhost:4000/')

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Navigate to="/all" replace/>}/>
        <Route path=":listId" element={<Layout component={Home}></Layout>}/>
        <Route path=":categoryId/:productId" element={<Layout component={ProductPage}></Layout>}/>
        <Route path="cart" element={<Layout component={Cart}></Layout>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

reportWebVitals()
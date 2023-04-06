import React, { Component } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './index.css'
import reportWebVitals from './reportWebVitals'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Layout from './pages/Layout'
import Cart from './pages/Cart'
import { client } from "@tilework/opus"

client.setEndpoint('http://localhost:4000/')
class Index extends Component {
  constructor() {
    super()
    this.state = { currency: {label: 'USD', symbol: "$"}, activeTab: "all"}
  }
  componentDidMount() {
    document.addEventListener("update-global", ({detail}) => {
      this.setState((state) => {
        return {...state, ...detail}
      })
    })
  }
  render() {
    return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout global={this.state} />}>
          <Route index element={<Home global={this.state}/>} />
          <Route path="product/:productId" element={<ProductPage global={this.state}/>} />
          <Route path="cart" element={<Cart global={this.state}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Index></Index>
  </React.StrictMode> 
)

reportWebVitals()

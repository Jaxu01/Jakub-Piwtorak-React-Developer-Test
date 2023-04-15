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
class Page extends Component {
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
    console.log(this.state)
    return (
      <this.props.component global={this.state}/>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page component={Layout}></Page>}>
          <Route index element={<Page component={Home}></Page>}/>
          <Route path="product/:productId" element={<Page component={ProductPage}></Page>}/>
          <Route path="cart" element={<Page component={Cart}></Page>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode> 
)

reportWebVitals()

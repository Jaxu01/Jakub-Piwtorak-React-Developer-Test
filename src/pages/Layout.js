import '../index.css'
import Currencies from "../components/Currencies.js"
import { useState, useEffect } from "react"
import { CurrencyProvider } from '../actions/CurrencyContext.js'
import { Outlet } from "react-router-dom"
import { client, Query } from "@tilework/opus"
import {ReactComponent as ReactLogo} from '../logo.svg'
import MiniCart from '../components/MiniCart.js'


function Layout() {
    const [activeTab, setActiveTab] = useState("all")
    const [categoryTabs, setCategoryTabs] = useState(null)

    const fetchData = async() => {
        const query = new Query('categories', true)
            .addFieldList(['name'])

        const {categories} = await client.post(query)
        setCategoryTabs(categories)
    }

    useEffect(() => {
        (async() => {
        await fetchData()
        })()
    }, [])


    const handleChange = (newActiveTab) => {
        setActiveTab(newActiveTab)
    }
    
    return (
        <CurrencyProvider>
            <div className="App">
            <header className="desktop">
                <nav className="navigation">
                <div className="section-left">
                    {categoryTabs?.map((category, index) => (
                        <button 
                            className={category.name === activeTab ? 'active tab-button' : 'tab-button'}
                            onClick={() => handleChange(category.name)} 
                            key={index}>
                            {category.name}
                        </button>
                    ))}
                </div>
                <div className="section-middle">
                <ReactLogo></ReactLogo>
                </div>
                <div className="section-right">
                    <Currencies></Currencies>
                    <MiniCart></MiniCart>
                </div>
                </nav>
            </header>
            <Outlet context={ activeTab }/>
            </div>
        </CurrencyProvider>
    )
}

export default Layout
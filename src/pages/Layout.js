import '../index.css';
import Currencies from "../Currencies";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { client, Field, Query } from "@tilework/opus";
import {ReactComponent as ReactLogo} from '../logo.svg';
import {ReactComponent as CartLogo} from '../cartIcon.svg';

function Layout() {
    const [activeTab, setActiveTab] = useState("all");
    const [currency, setCurrency] = useState({label: 'USD', symbol: "$"});
    const [categoryTabs, setCategoryTabs] = useState(null);

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

    const handleCurrency = (currency) => {
    setCurrency(currency)
    }

    const handleChange = (newActiveTab) => {
        setActiveTab(newActiveTab);
    }
    
    return (
        <div className="App">
        <header className="desktop">
            <nav className="navigation">
            <div className="section-left">
                {categoryTabs?.map((category, index) => (
                    <button 
                        className={category.name === activeTab ? 'active tab-button' : 'tab-button'}
                        onClick={() => handleChange(category.name)} 
                        key={index}
                    >{category.name}</button>
                ))}
            </div>
            <div className="section-middle">
               <ReactLogo></ReactLogo>
            </div>
            <div className="section-right">
                <Currencies activeCurrency={currency} setCurrency={handleCurrency}/>
                <CartLogo></CartLogo>
            </div>
            </nav>
        </header>
        <Outlet context={ [currency, activeTab] }/>
        </div>
    )
}

export default Layout;
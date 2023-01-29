import '../index.css';
import Currencies from "../Currencies";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { client, Field, Query } from "@tilework/opus";
import {ReactComponent as ReactLogo} from '../logo.svg';
import {ReactComponent as CartLogo} from '../cartIcon.svg';

function Layout() {
    const [activeTab, setActiveTab] = useState(0);
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
                    <p key={index}>{category.name}</p>
                ))}
                <button className={"0" === activeTab? 'active tab-button': 'tab-button'} data-active-index="0" onClick={({target}) => handleChange(target.dataset.activeIndex)}>WOMEN</button>
                <button className={"1" === activeTab? 'active tab-button': 'tab-button'} data-active-index="1" onClick={({target}) => handleChange(target.dataset.activeIndex)}>MEN</button>
                <button className={"2" === activeTab? 'active tab-button': 'tab-button'} data-active-index="2" onClick={({target}) => handleChange(target.dataset.activeIndex)}>KIDS</button>
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
        <Outlet context={ currency }/>
        </div>
    )
}

export default Layout;
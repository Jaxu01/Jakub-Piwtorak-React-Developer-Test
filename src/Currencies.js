import { useState, useEffect } from "react";
import { Query, client } from '@tilework/opus';


function Currencies() {
const [currencies, setCurrencies] = useState([]);
const [activeCurrency, setActiveCurrency] = useState([]);
const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchData = (async() => {
        client.setEndpoint('http://localhost:4000/')
        const query = new Query('currencies', true)
            .addFieldList(['label', 'symbol']);
        
        const result = await client.post(query);
        setCurrencies(result.currencies)
        console.log(result)
        });
        fetchData()
    }, []);

    return (
        <>
            <div className="section-right">
                {dropdownOpen && <Dropdown currencies={currencies} />}
            </div>
            <svg onClick={() => setDropdownOpen((prev) => !prev)}  width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0.5L4 3.5L7 0.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </>
    )
}

function Dropdown({currencies}) {
    return (
        <div className="currencies-container">
            {currencies?.map((currency, index) => (
                <div key={index} className="currency-div">
                    <div className="symbol"></div>
                    <p>{currency.symbol}</p>
                    <div className="label"></div>
                    <p>{currency.label}</p>
                </div>
            ))}
        </div>
    )
}

export default Currencies;
import { useState, useEffect, useContext } from "react";
import { Query, client } from '@tilework/opus';
import { useGeneral, useGeneralUpdate } from "./GeneralContext";


function Currencies({setCurrency}) {
const [state, setState] = useState({
    currencies: [],
    activeCurrency: {symbol : "$"},
    dropdownOpen: false
});

    useEffect(() => {
        const fetchData = (async() => {
            client.setEndpoint('http://localhost:4000/')
            const query = new Query('currencies', true)
            .addFieldList(['label', 'symbol'])
            
            const result = await client.post(query)
            setState({...state, currencies: result.currencies})
        });
        fetchData()
    }, []);
    const handleDropdownOpen = () => {
        setState((prev) => {
            return {...state, dropdownOpen: !prev.dropdownOpen}
        })
    }

    return (
        <>
            <div className="default-currency">
                {state.activeCurrency && (
                    <div className="active-currency">
                        <p>{state.activeCurrency.symbol}</p>
                    </div>
                )}
            </div>
            <div className="section-right-currencies">
                {state.dropdownOpen && (
                    <div className="currencies-container">
                        {state.currencies?.map((currency, index) => (
                            <div key={index} onClick={() => setCurrency(currency.label)} className="currency-div">
                                <p>{currency.symbol}</p>
                                <p>{currency.label}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <svg onClick={handleDropdownOpen} width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0.5L4 3.5L7 0.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </>
    )
}

export default Currencies;
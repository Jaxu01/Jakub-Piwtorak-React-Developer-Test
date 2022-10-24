import { useState, useEffect, useContext } from "react";
import { Query, client } from '@tilework/opus';
import { useGeneral, useGeneralUpdate } from "./GeneralContext";


function Currencies() {
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
                {state.activeCurrency && <Currency activeCurrency={state.activeCurrency} />}
            </div>
            <div className="section-right-currencies">
                {state.dropdownOpen && <Dropdown currenciesState={state} setCurrenciesState={setState}/>}
            </div>
            <svg onClick={handleDropdownOpen} width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0.5L4 3.5L7 0.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </>
    )
}

function Currency({activeCurrency}) {
    return (
        <div className="active-currency">
            <p>{activeCurrency.symbol}</p>
        </div>
    )
}

function Dropdown({setCurrenciesState, currenciesState}) {
    // const general = useContext(GeneralContext);
    // const handleCurrencyUpdate = (currency) => {
    //     general.updateCurrency(currency.label)
    //     setCurrenciesState({...currenciesState, activeCurrency: currency, dropdownOpen: false})
    const generalUpdate = useGeneralUpdate()
    const general = useGeneral()
    console.log(general)
    // }
    return (
        <div className="currencies-container">
            {currenciesState.currencies?.map((currency, index) => (
                <div key={index} onClick={() => generalUpdate({currency})} className="currency-div">
                    <p>{currency.symbol}</p>
                    <p>{currency.label}</p>
                </div>
            ))}
        </div>
    )
}

export default Currencies;
import { useState, useEffect } from "react";
import { Query, client } from '@tilework/opus';
import { ReactComponent as DropdownLogo} from "./dropdown.svg";

function Currencies({activeCurrency, setCurrency}) {
const [state, setState] = useState({
    currencies: [],
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
                {activeCurrency && (
                    <div className="active-currency">
                        <p>{activeCurrency.symbol}</p>
                    </div>
                )}
            </div>
            <div className="section-right-currencies">
                {state.dropdownOpen && (
                    <div className="currencies-container">
                        {state.currencies?.map((currency, index) => (
                            <div key={index} onClick={() => setCurrency(currency)} className="currency-div">
                                <p>{currency.symbol}</p>
                                <p>{currency.label}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <DropdownLogo onClick={handleDropdownOpen}></DropdownLogo>
        </>
    )
}

export default Currencies;
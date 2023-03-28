import { useState, createContext, useContext } from "react"

const CurrencyUpdateContext = createContext()
const CurrencyContext = createContext()
const useCurrency = () => {
    return useContext(CurrencyContext)
}

const useUpdateCurrency = () => {
    return useContext(CurrencyUpdateContext)
}

const CurrencyProvider = ({children}) => {
    const [currency, setCurrency] = useState({label: 'USD', symbol: "$"})
    
    return (
        <CurrencyContext.Provider value={ currency }>
            <CurrencyUpdateContext.Provider value={ setCurrency }>
                {children}
            </CurrencyUpdateContext.Provider>
        </CurrencyContext.Provider>
    )
}

export {CurrencyProvider, useCurrency, useUpdateCurrency}
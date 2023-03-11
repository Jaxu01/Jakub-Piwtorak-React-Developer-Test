import { useOutletContext } from "react-router-dom";


const usePriceFormat = (price) => {
    const [currency] = useOutletContext()
    return currency.symbol + price.toFixed(2)
}

export {usePriceFormat};
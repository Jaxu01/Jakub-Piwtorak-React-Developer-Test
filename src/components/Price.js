import { useCurrency } from '../actions/CurrencyContext.js'

const Price = ({price}) => {
    const currency = useCurrency()
    console.log(currency)
    const formatedPrice = currency.symbol + parseFloat(price).toFixed(2)
    return <span>{formatedPrice}</span>
}

export default Price
import { useOutletContext } from "react-router-dom";

const Price = ({price}) => {
    console.log(price)
    const [currency] = useOutletContext()
    const formatedPrice = currency.symbol + parseFloat(price).toFixed(2)

    return <span>{formatedPrice}</span>
}

export default Price;
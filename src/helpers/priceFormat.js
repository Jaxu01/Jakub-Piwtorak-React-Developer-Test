const priceFormat = (price, currencySymbol) => {
    return currencySymbol + parseFloat(price).toFixed(2)
}

export default priceFormat
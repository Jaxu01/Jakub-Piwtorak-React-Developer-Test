const initial = { currency: {label: 'USD', symbol: "$"}}

const getItems = () => JSON.parse(localStorage.getItem("global")) ?? initial

const setItems = (itemToStore) => {
    localStorage.setItem("global", JSON.stringify(itemToStore))
}

export {getItems, setItems}
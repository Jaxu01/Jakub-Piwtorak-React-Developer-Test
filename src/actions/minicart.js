const getItems = () => JSON.parse(localStorage.getItem("minicart")) ?? []

const setItems = (itemToStore) => {
    localStorage.setItem("minicart", JSON.stringify(itemToStore))
}

const findExistingProduct = (miniCart, newItem) => {
    return miniCart.find(product => product.productId === newItem.productId && JSON.stringify(product.attribute) === JSON.stringify(newItem.attribute))
}

const changeProductAmount = (productChoices, change) => {
    const miniCart = getItems()
    const existingProduct = findExistingProduct(miniCart, productChoices)
    let itemToStore = []
    if (existingProduct) {
        itemToStore = miniCart.map((item) => {
            if (JSON.stringify(item) === JSON.stringify(existingProduct)) {
                item.amount = item.amount + change
            }
            return item
        })
        itemToStore = itemToStore.filter(item => item.amount > 0)
    }
    setItems(itemToStore)
}

const addItem = (productChoices) => {
    const miniCart = getItems()
    const existingProduct = findExistingProduct(miniCart, productChoices)
    let itemToStore = []
    if (existingProduct) {
        itemToStore = miniCart.map(item => {
            if (JSON.stringify(item) === JSON.stringify(existingProduct)) {
                item.amount++
            }
            return item
        })
    }
    else {
        productChoices.amount = 1
        itemToStore = [...miniCart, productChoices]
    }
    setItems(itemToStore)
}


export {getItems, addItem, setItems, findExistingProduct, changeProductAmount}
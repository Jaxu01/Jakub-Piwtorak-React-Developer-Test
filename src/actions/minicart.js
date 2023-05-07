import { objectCompare } from "../utils/helpers.js"

const getItems = () => JSON.parse(localStorage.getItem("minicart")) ?? []

const setItems = (itemToStore) => {
    localStorage.setItem("minicart", JSON.stringify(itemToStore))
}

const findExistingProduct = (miniCart, newItem) => {
    return miniCart.find(product => product.productId === newItem.productId && objectCompare(product.attribute, newItem.attribute))
}

const changeProductAmount = (newItem, change) => {
    const miniCart = getItems()
    const existingProduct = findExistingProduct(miniCart, newItem)
    let itemToStore = []
    if (existingProduct) {
        itemToStore = miniCart.map((item) => {
            if (objectCompare(item, existingProduct)) {
                item.amount = item.amount + change
            }
            return item
        })
        itemToStore = itemToStore.filter(item => item.amount > 0)
    }
    setItems(itemToStore)
}

const addItem = (newItem) => {
    const miniCart = getItems()
    const existingProduct = findExistingProduct(miniCart, newItem)
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
        newItem.amount = 1
        itemToStore = [...miniCart, newItem]
    }
    setItems(itemToStore)
}


export {getItems, addItem, setItems, findExistingProduct, changeProductAmount}
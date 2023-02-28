import { findExistingProduct } from "./product.js"

const getItems = () => JSON.parse(localStorage.getItem("minicart")) ?? []

const addItem = (newProduct) => {
    const miniCart = getItems()
    const existingProduct = findExistingProduct(miniCart, newProduct)
    let itemToStore = []
    if(existingProduct) {
        itemToStore = miniCart.map(item => {
            if(JSON.stringify(item) === JSON.stringify(existingProduct)) {
                item.amount++
            }
            return item
        })
    }
    else {
        newProduct.amount = 1
        itemToStore = [...miniCart, newProduct]
    }
    localStorage.setItem("minicart", JSON.stringify(itemToStore))
}

export {getItems, addItem}
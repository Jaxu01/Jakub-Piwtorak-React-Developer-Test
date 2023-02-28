const findExistingProduct = (miniCart, newItem) => {
    return miniCart.find(product => product.productId === newItem.productId && JSON.stringify(product.attribute) === JSON.stringify(newItem.attribute))
}

const createNewProduct = (formElement) => {
    const formData = new FormData(formElement)
    const object = {}
    formData.forEach(function(value, key){
        const [name, name2] = key.split(".")
        if(name2) {
            object[name] = object[name] ?? {}
            object[name][name2] = value
        }
        else {
            object[name] = value
        }
    });
    return object
}

export {findExistingProduct, createNewProduct};
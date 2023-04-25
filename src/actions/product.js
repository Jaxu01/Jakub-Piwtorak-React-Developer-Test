const createNewProduct = (formElement) => {
    const formData = new FormData(formElement)
    const object = {}
    formData.forEach(function(value, key) {
        const [name, name2] = key.split(".")
        if (name2) {
            object[name] = object[name] ?? {}
            object[name][name2] = value
        }
        else {
            object[name] = value
        }
    })
    return object
}

export {createNewProduct}
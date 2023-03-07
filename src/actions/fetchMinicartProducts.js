import { client, Field, Query } from "@tilework/opus";

const makeProductQuery = (cartItem) => {
    const query = new Query('product', true)
        .addArgument('id', 'String!', cartItem.productId)
        .addFieldList(['name', 'gallery', 'description', 'brand'])
        .addField(new Field('prices')
            .addFieldList(['amount'])
            .addField(new Field('currency')
                .addFieldList(['label', 'symbol'])
            )
        )
        .addField(new Field('attributes')
            .addFieldList(['id', 'name', 'type'])
            .addField(new Field('items')
                .addFieldList(['displayValue', 'value', 'id'])
            )
        )
    return query
}


const fetchProduct = async(productQuery, currencyLabel) => {
    const {product} = await client.post(productQuery)
    const activePrice = new Object(product.prices.find(price => price.currency.label === currencyLabel))
    return {...Object(product), activePrice}
}

const fetchMinicartProducts = async(minicart, currencyLabel) => {
    const products = await Promise.all(minicart.map(async(cartItem) => {
        const productQuery = makeProductQuery(cartItem)
        const product = await fetchProduct(productQuery, currencyLabel)
        return {...product, choices: cartItem}
    }))
    return products
}

export default fetchMinicartProducts;
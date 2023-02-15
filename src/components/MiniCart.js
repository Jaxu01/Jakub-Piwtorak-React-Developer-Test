import { useState, useEffect } from "react";
import { client, Field, Query } from "@tilework/opus";
import {ReactComponent as CartIcon} from '../cartIcon.svg';
import Dropdown from "../components/Dropdown.js";
import './MiniCart.css';

const MiniCart = ({currency}) => {
    const [cartProducts, setCartProducts] = useState([]);
    const minicartStorage = localStorage.getItem("minicart")
    const minicart = JSON.parse(minicartStorage)
    console.log(cartProducts)
    
    const fetchProduct = async(cartItem) => {
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
        const {product} = await client.post(query)
        const activePrice = new Object(product.prices.find(price => price.currency.label === currency.label))
        return {...Object(product), activePrice, choices: cartItem}
    }

    const fetchData = () => {
        const products = []
        if (minicart.length) {
            minicart.forEach(async cartItem => {
                products.push(await fetchProduct(cartItem))
            })
        }
        setCartProducts(products)
    }

    useEffect(() => {
                (async() => {
                    await fetchData()
                })()
    }, [])

    
    return (
        <Dropdown title={<CartIcon></CartIcon>}> 
                {!cartProducts.length &&
                    (
                        <p>No Items Available</p>
                    )
                }
            {!!cartProducts.length && cartProducts.map((cartProduct, index) => (
                    <div key={index} className="product-info">
                        <div className="information-box">
                            <div>{cartProduct.name}</div>
                            <div>{cartProduct.brand}</div>
                            <div className="price">{cartProduct.activePrice.currency.symbol}{cartProduct.activePrice.amount}</div>
                            <div>{cartProduct.attributes.map(function (attribute, index) {
                                        return (
                                            <div className="minicart-radio-tiles" style={{backgroundColor: cartProduct.choices[attribute.id]}} key={index}>
                                                {attribute.name}
                                                {attribute.items.map(function (item, index) {
                                                    return (
                                                            <label key={index} htmlFor={item.id} style={{backgroundColor: item.value}}> 
                                                                    <div className="minicart-radio-tile">
                                                                        {item.displayValue}
                                                                    </div>
                                                            </label>
                                                    )
                                                })}
                                            </div>
                                        )
                                })}</div>
                            </div>
                        <div className="image-box">
                            <img src={cartProduct.gallery[0]}/>
                        </div>
                    </div>
            ))}
        </Dropdown>
    )
}

export default MiniCart;
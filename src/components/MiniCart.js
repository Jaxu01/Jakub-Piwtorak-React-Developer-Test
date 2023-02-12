import { useState, useEffect } from "react";
import { client, Field, Query } from "@tilework/opus";
import {ReactComponent as CartIcon} from '../cartIcon.svg';
import Dropdown from "../components/Dropdown.js";
import './MiniCart.css';

const MiniCart = ({currency}) => {
    const [cartProducts, setCartProducts] = useState([]);
    const minicartStorage = localStorage.getItem("minicart")
    const minicart = JSON.parse(minicartStorage)
    console.log(minicartStorage)
    console.log(cartProducts)
    
    const fetchProduct = async(productId) => {
        const query = new Query('product', true)
        .addArgument('id', 'String!', productId)
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
        return {...Object(product), activePrice}
    }

    const fetchData = () => {
        const products = []
        if (minicart.length) {
            minicart.forEach(async cartItem => {
                products.push(await fetchProduct(cartItem.productId))
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
            {cartProducts.length && cartProducts.map(cartProduct => (
                <>
                    <div>{cartProduct.name}</div>
                    <div>{cartProduct.brand}</div>
                    <div>{cartProduct.activePrice.currency.symbol}{cartProduct.activePrice.amount}</div>
                    <div>{cartProduct.attributes.map(function (attribute, index) {
                                return (
                                    <div key={index}>{attribute.name}
                                        {attribute.items.map(function (item, index) {
                                            return (
                                                    <label key={index} htmlFor={item.id}> 
                                                        <input value={item.value} id={item.id} name={attribute.name} type="radio"/>
                                                            <div className="radio-tile">
                                                                {item.displayValue}
                                                            </div>
                                                    </label>
                                            )
                                        })}
                                    </div>
                                )
                            })}</div>
                    <img src={cartProduct.gallery[0]}/>
                </>
            ))}
        </Dropdown>
    )
}

export default MiniCart;
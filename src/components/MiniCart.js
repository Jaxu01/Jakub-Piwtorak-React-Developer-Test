import { useState, useEffect } from "react";
import { client, Field, Query, CombinedField } from "@tilework/opus";
import {ReactComponent as CartIcon} from '../cartIcon.svg';
import Dropdown from "../components/Dropdown.js";
import MiniCartAttributeText from "./MiniCartAttributeText.js";
import MiniCartAttributeSwatch from "./MiniCartAttributeSwatch.js";
import './MiniCart.css';

const MiniCart = ({currency}) => {
    const [cartList, setCartList] = useState({products: [], amount: 0, totalPrice: 0});
    const minicartStorage = localStorage.getItem("minicart")
    const minicart = JSON.parse(minicartStorage)
    
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
    const fetchProducts = async(combinedField) => {
        const {product} = await client.post(combinedField)
        const activePrice = new Object(product.prices.find(price => price.currency.label === currency.label))
        return {...Object(product), activePrice}
    }
    
    const fetchData = async() => {
        var amount = 0
        var totalPrice = 0
        const combinedField = new CombinedField
        if (minicart.length) {
            const productQueries = new Set(minicart.map(cartItem => {
                return makeProductQuery(cartItem)
            }))
            productQueries.forEach(productQuery => {
                combinedField.add(productQuery)
            })
            // amount += cartItem.amount
            // totalPrice = totalPrice + (product.activePrice.amount * product.choices.amount)
            const products = await fetchProducts(combinedField)
            console.log(products)
            setCartList({products, amount: amount, totalPrice: totalPrice})
        }
        console.log(totalPrice)
    }

    useEffect(() => {
                (async() => {
                    await fetchData()
                })()
    }, [])

    // const AmountChanger = (cartItem) => {
    //     // localStorage.setItem('minicart', cartItem.productId)
    //     // let currentAmount = localStorage.getItem("productId")
    //     // localStorage.setItem("productId", currentAmount++)
    //     // console.log(currentAmount)
    //     // AmountChanger()
    // }

    return (
        <Dropdown dispatchEvent="minicart:set-open" title={<CartIcon></CartIcon>}> 
                {!cartList.products.length &&
                    (
                        <p>No Items Available</p>
                    )
                }
            <div className="minicart-description">My Bag, 2 Items</div>
            {!!cartList.products.length && cartList.products.map((cartProduct, index) => (
                <>
                    <div key={index} className="product-info">
                        <div className="information-box">
                            <div>{cartProduct.name}</div>
                            <div>{cartProduct.brand}</div>
                            <div className="price">{cartProduct.activePrice.currency.symbol}{cartProduct.activePrice.amount}</div>
                            <div>{cartProduct.attributes.map(function (attribute, index) {
                                        return (
                                            <div className="minicart-radio-tiles" key={index}>
                                                {attribute.name}
                                                {attribute.type !=="swatch" ? 
                                                    <MiniCartAttributeText
                                                        choice={cartProduct.choices.attribute[attribute.id]}
                                                        items={attribute.items}
                                                    ></MiniCartAttributeText> 
                                                    :
                                                    <MiniCartAttributeSwatch
                                                        choice={cartProduct.choices.attribute[attribute.id]}
                                                        items={attribute.items}
                                                    ></MiniCartAttributeSwatch>
                                                }
                                            </div>
                                        )
                                })}</div>
                            </div>
                        <div className="amount-changer">
                            <div className="increase-amount">
                                <button className="plus-button">+</button>
                            </div>
                            <div className="product-amount">
                                <p>{cartProduct.choices.amount}</p>
                            </div>
                            <div className="decrease-amount">
                                <button className="minus-button">-</button>
                            </div>
                        </div>
                        <div className="image-box">
                            <img src={cartProduct.gallery[0]}/>
                        </div>
                    </div>
                </>
            ))}
            <div className="total-cost">Total {cartList.totalPrice}</div>
            <div className="minicart-buttons">
                <a href="/viewbag" target="_blank" className="view-bag">view bag</a>
                <a href="/checkout" target="_blank" className="checkout">checkout</a>
            </div>
        </Dropdown>
    )
}

export default MiniCart;
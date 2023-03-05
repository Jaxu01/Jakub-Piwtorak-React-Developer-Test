import { useState, useEffect } from "react";
import { client, Field, Query } from "@tilework/opus";
import {ReactComponent as CartIcon} from '../cartIcon.svg';
import Dropdown from "../components/Dropdown.js";
import MiniCartAttributeText from "./MiniCartAttributeText.js";
import MiniCartAttributeSwatch from "./MiniCartAttributeSwatch.js";
import { changeProductAmount, getItems } from '../actions/minicart.js';
import './MiniCart.css';

const MiniCart = ({currency}) => {
    const [cartList, setCartList] = useState({products: [], amount: 0, totalPrice: 0});
    
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


    const fetchProduct = async(productQuery) => {
        const {product} = await client.post(productQuery)
        const activePrice = new Object(product.prices.find(price => price.currency.label === currency.label))
        return {...Object(product), activePrice}
    }

    const fetchData = async(minicart) => {
        const products = await Promise.all(minicart.map(async(cartItem) => {
            const productQuery = makeProductQuery(cartItem)
            const product = await fetchProduct(productQuery)
            // amount += cartItem.amount
            return {...product, choices: cartItem}
        }))
        const totalPrice = products.reduce((accumulator, product) => {
            console.log(accumulator)
            return accumulator + (product.activePrice.amount * product.choices.amount)
        }, 0)
        const amount = products.reduce((accumulator, product) => {
            return accumulator + product.choices.amount
        }, 0)
        setCartList({products, totalPrice, amount})
    }

    const updateList = async() => {
        console.log('test')
        const minicart = getItems()
        if (minicart?.length) {
            await fetchData(minicart)
        }
        else {
            setCartList({products: [], amount: 0, totalPrice: 0})
        }
    }

    useEffect(() => {
        (async() => {
            document.addEventListener("minicart:update", () => {
                updateList()
            })
            await updateList()
        })()
    }, [])

    const amountChanger = async(productChoices, change) => {
        changeProductAmount(productChoices, change)
        await updateList()
        console.log(change)
    }

    return (
        <Dropdown dispatchEvent="minicart:set-open" title={<CartIcon/>}> 
                {!cartList.products.length &&
                    (
                        <p>No Items Available</p>
                    )
                }
            <div className="minicart-description">My Bag, {cartList.amount} Items</div>
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
                                <button onClick={() => amountChanger(cartProduct.choices, 1)} className="plus-button">+</button>
                            </div>
                            <div className="product-amount">
                                <p>{cartProduct.choices.amount}</p>
                            </div>
                            <div className="decrease-amount">
                                <button onClick={() => amountChanger(cartProduct.choices, -1)} className="minus-button">-</button>
                            </div>
                        </div>
                        <div className="image-box">
                            <img className="cart-image" src={cartProduct.gallery[0]}/>
                        </div>
                    </div>
                </>
            ))}
            <strong className="total-cost">Total
                <div className="total">{currency.symbol}{cartList.totalPrice}</div>
            </strong>
            <div className="minicart-buttons">
                <a href="/viewbag" target="_blank" className="view-bag">view bag</a>
                <a href="/checkout" target="_blank" className="checkout">checkout</a>
            </div>
        </Dropdown>
    )
}

export default MiniCart;
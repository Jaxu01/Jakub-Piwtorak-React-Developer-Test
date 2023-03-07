import { useState, useEffect } from "react";
import {ReactComponent as CartIcon} from '../cartIcon.svg';
import Dropdown from "../components/Dropdown.js";
import MiniCartAttributeText from "./MiniCartAttributeText.js";
import MiniCartAttributeSwatch from "./MiniCartAttributeSwatch.js";
import { changeProductAmount, getItems } from '../actions/minicart.js';
import './MiniCart.css';
import fetchMinicartProducts from "../actions/fetchMinicartProducts.js";

const MiniCart = ({currency}) => {
    const [cartList, setCartList] = useState({products: [], amount: 0, totalPrice: 0});
    

    const fetchData = async(minicart) => {
        const products = await fetchMinicartProducts(minicart, currency.label)
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
            <div className="minicart-description"><span className="my-bag">My Bag</span>, {cartList.amount} Items</div>
            {!!cartList.products.length && cartList.products.map((cartProduct, index) => (
                    <div key={index} className="product-info">
                        <div className="information-box">
                            <div>{cartProduct.name}</div>
                            <div>{cartProduct.brand}</div>
                            <div className="price">{cartProduct.activePrice.currency.symbol}{cartProduct.activePrice.amount}</div>
                            <div>{cartProduct.attributes.map(function (attribute, index) {
                                        return (
                                            <div className="minicart-radio-tiles" key={index}>
                                                {attribute.name}:
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
            ))}
            <strong className="total-cost">Total
                <div className="total">{currency.symbol}{cartList.totalPrice}</div>
            </strong>
            <div className="minicart-buttons">
                <a href="/cart" className="view-bag">view bag</a>
                <a className="checkout">checkout</a>
            </div>
        </Dropdown>
    )
}

export default MiniCart;
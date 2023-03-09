import { useState, useEffect } from "react";
import MiniCartAttributeText from "../components/MiniCartAttributeText.js";
import MiniCartAttributeSwatch from "../components/MiniCartAttributeSwatch.js";
import fetchMinicartProducts from "../actions/fetchMinicartProducts.js";
import { useOutletContext } from "react-router-dom";
import { getItems } from "../actions/minicart.js";
import './Cart.css'

const Cart = () => {
    const [cartList, setCartList] = useState({products: [], amount: 0, totalPrice: 0});
    const [currency] = useOutletContext()
    console.log(cartList)
    
    const fetchData = async() => {
        const minicart = getItems()
        const {products, details} = await fetchMinicartProducts(minicart, currency.label)
        setCartList({products, ...details})
        }

    useEffect(() => {
            (async() => {
                await fetchData()
            })()
    }, [])    

    return (
        <>
        <div className="cart">
            <div className="cart-name">Cart</div>
            <div className="bar"></div>
                <div className="cart-details">
                    {!!cartList.products.length && cartList.products.map((cartProduct, index) => (
                            <div key={index} className="product-info-cart">
                                <div className="information-box-cart">
                                    <div className="product-name-cart">{cartProduct.name}</div>
                                    <div className="product-brand-cart">{cartProduct.brand}</div>
                                    <div className="price-cart">{cartProduct.activePrice.currency.symbol}{cartProduct.activePrice.amount}</div>
                                    <div>{cartProduct.attributes.map(function (attribute, index) {
                                                return (
                                                    <div className="minicart-radio-tiles-cart" key={index}>
                                                        {attribute.name}:
                                                        {attribute.type !=="swatch" ? 
                                                            <MiniCartAttributeText 
                                                                className="cart-page-tile"
                                                                choice={cartProduct.choices.attribute[attribute.id]}
                                                                items={attribute.items}
                                                            ></MiniCartAttributeText> 
                                                            :
                                                            <MiniCartAttributeSwatch
                                                                className="cart-page-tile-swatch"
                                                                choice={cartProduct.choices.attribute[attribute.id]}
                                                                items={attribute.items}
                                                            ></MiniCartAttributeSwatch>
                                                        }
                                                    </div>
                                                )
                                        })}</div>
                                    </div>
                                <div className="amount-changer-cart">
                                    <div className="increase-amount">
                                        <button className="plus-button-cart">+</button>
                                    </div>
                                    <div className="product-amount-cart">
                                        <p>{cartProduct.choices.amount}</p>
                                    </div>
                                    <div className="decrease-amount">
                                        <button className="minus-button-cart">-</button>
                                    </div>
                                </div>
                                <div className="image-cart">
                                    <img src={cartProduct.gallery[0]}/>
                                </div>
                            </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Cart;
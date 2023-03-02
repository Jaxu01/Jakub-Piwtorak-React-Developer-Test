import { useState, useEffect } from "react";
import MiniCartAttributeText from "../components/MiniCartAttributeText.js";
import MiniCartAttributeSwatch from "../components/MiniCartAttributeSwatch.js";
import './Cart.css'

const Cart = () => {
    const [cartList, setCartList] = useState({products: [], amount: 0, totalPrice: 0});
    
    const fetchData = async() => {
        var amount = 0
        var totalPrice = 0
        var products = []
        setCartList({products, amount: amount, totalPrice: totalPrice})
        }

    useEffect(() => {
            (async() => {
                await fetchData()
            })()
    }, [])    

    return (
        <>
        <div className="cart-name">Cart</div>
        <div className="bar"></div>
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
    </>
    )
}

export default Cart;
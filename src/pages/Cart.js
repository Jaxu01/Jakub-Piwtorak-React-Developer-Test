import { Component } from "react"
import MiniCartAttributeText from "../components/MiniCartAttributeText.js"
import MiniCartAttributeSwatch from "../components/MiniCartAttributeSwatch.js"
import fetchMinicartProducts from "../actions/fetchMinicartProducts.js"
import GallerySwitcher from "../components/GallerySwitcher.js"
import { getItems, changeProductAmount } from "../actions/minicart.js"
import priceFormat from '../helpers/priceFormat.js'
import styled from "styled-components"
import './Cart.css'

class Cart extends Component {
    constructor(props) {
        super(props)
        this.state = {products: [], amount: 0, totalPrice: 0}
        this.currency = this.props.global.currency
    }

    taxMoney() {
        const tax = this.state.totalPrice * 0.21
        return tax
    }

    async amountChanger(productChoices, change) {
        changeProductAmount(productChoices, change)
        await this.updateList()
    }

    async updateList() {
        const minicart = getItems()
        if (minicart?.length) {
            await this.fetchData(minicart)
        }
        else {
            this.setState({products: [], amount: 0, totalPrice: 0})
        }
    }
    
    async fetchData() {
        const minicart = getItems()
        const {products, details} = await fetchMinicartProducts(minicart, this.props.global.currency.label)
        this.setState({products, ...details})
    }

    async componentDidMount() {
        await this.fetchData()
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.global.currency.label !== this.props.global.currency.label) {
            this.updateList()
        }
    }

    render() {
        const Cart = styled.div`
            max-width: 1240px;
            margin: auto;
            padding: 0 40px;
        `
        const CartName = styled.div`
            font-family: 'Raleway';
            font-style: normal;
            font-weight: 700;
            font-size: 32px;
            line-height: 40px;
            text-transform: uppercase;
            color: #1D1F22;
            padding-bottom: 55px;
        `
        const Bar = styled.div`
            height: 1px;
            background: #E5E5E5;
            max-width: 100%;
        `
        const InformationBoxCart = styled.div`
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 16px;
            font-family: 'Raleway';
            font-style: normal;
            font-weight: 300;
            font-size: 16px;
            line-height: 160%;
        `
        return (
            <Cart>
                <CartName>Cart</CartName>
                <Bar/>
                    <div className="cart-details">
                        {!!this.state.products.length && this.state.products.map((cartProduct, index) => (
                            <div key={index} className="product-info-cart">
                                <InformationBoxCart>
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
                                </InformationBoxCart>
                                <div className="amount-changer-cart">
                                    <div className="increase-amount">
                                        <button onClick={() => this.amountChanger(cartProduct.choices, 1)} className="plus-button-cart">+</button>
                                    </div>
                                    <div className="product-amount-cart">
                                        <p>{cartProduct.choices.amount}</p>
                                    </div>
                                    <div className="decrease-amount">
                                        <button onClick={() => this.amountChanger(cartProduct.choices, -1)} className="minus-button-cart">-</button>
                                    </div>
                                </div>
                                <div className="image-cart">
                                    <GallerySwitcher gallery={cartProduct.gallery}></GallerySwitcher>
                                </div>
                            </div>
                        ))}
                    </div>
                <div className="final-details">
                    <div className="tax">Tax 21%:  <span className="tax-result">{priceFormat(this.taxMoney(), this.props.global.currency.symbol)}</span></div>
                    <div className="quantity">Quantity: <span className="quantity-result">{this.state.amount}</span></div>
                    <div className="total-cart">Total: <span className="total-result">{priceFormat(this.state.totalPrice, this.props.global.currency.symbol)}</span></div>
                </div>
                <button className="order">Order</button>
            </Cart>
        )
    }
}

export default Cart
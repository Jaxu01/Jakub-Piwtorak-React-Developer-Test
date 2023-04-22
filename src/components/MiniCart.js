import { Component } from "react"
import {ReactComponent as CartIcon} from '../cartIcon.svg'
import Dropdown from "../components/Dropdown.js"
import MiniCartAttributeText from "./MiniCartAttributeText.js"
import MiniCartAttributeSwatch from "./MiniCartAttributeSwatch.js"
import priceFormat from "../helpers/priceFormat.js"
import { changeProductAmount, getItems } from '../actions/minicart.js'
import fetchMinicartProducts from "../actions/fetchMinicartProducts.js"
import './MiniCart.css'

class MiniCart extends Component {
    constructor(props) {
        super(props)
        this.state = {products: [], amount: 0, totalPrice: 0}
        this.currency = this.props.activeCurrency
    }
    
    async fetchData(minicart) {
        const {products, details} = await fetchMinicartProducts(minicart, this.props.activeCurrency.label)
        this.setState({products, ...details})
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

    async componentDidUpdate(prevProps) {
        if (prevProps.activeCurrency.label !== this.props.activeCurrency.label) {
            await this.updateList()
        }
    }

    async componentDidMount() {
        document.addEventListener("minicart:update", () => {
            this.updateList()
        })
        await this.updateList()
    }

    async amountChanger(productChoices, change) {
        changeProductAmount(productChoices, change)
        await this.updateList()
    }

    render() {
        return (
            <Dropdown dispatchEvent="minicart:set-open" className="minicart" title={<CartIcon/>}>
                {!this.state.products.length &&
                    (
                        <p>No Items Available</p>
                    )
                }
                <div className="minicart-description"><span className="my-bag">My Bag</span>, {this.state.amount} Items</div>
                {!!this.state.products.length && this.state.products.map((cartProduct, index) => (
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
                                    <button onClick={() => this.amountChanger(cartProduct.choices, 1)} className="plus-button">+</button>
                                </div>
                                <div className="product-amount">
                                    <p>{cartProduct.choices.amount}</p>
                                </div>
                                <div className="decrease-amount">
                                    <button onClick={() => this.amountChanger(cartProduct.choices, -1)} className="minus-button">-</button>
                                </div>
                            </div>
                            <div className="image-box">
                                <img className="cart-image" src={cartProduct.gallery[0]}/>
                            </div>
                        </div>
                ))}
                <strong className="total-cost">Total
                    <div className="total"> {priceFormat(this.state.totalPrice, this.props.activeCurrency.symbol)}</div>
                </strong>
                <div className="minicart-buttons">
                    <a href="/cart" className="view-bag">view bag</a>
                    <a className="checkout">checkout</a>
                </div>
            </Dropdown>
        )
    }
}

export default MiniCart
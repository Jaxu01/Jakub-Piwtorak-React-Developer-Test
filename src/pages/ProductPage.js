import { client, Field, Query } from "@tilework/opus"
import { withRouter } from "../fallback/react-router.js"
import { Component } from "react"
import ProductGallery from '../components/ProductGallery.js'
import { addItem } from '../actions/minicart.js'
import { createNewProduct } from '../actions/product.js'
import priceFormat from '../helpers/priceFormat.js'
import styled from "styled-components"
import './ProductPage.css'


class ProductPage extends Component {
    constructor(props) {
        super(props)
        this.state = null
        this.currency = this.props.global.currency
        this.productId = this.props.router.params.productId
    }

    async fetchData() {
        const query = new Query('product', true)
        .addArgument('id', 'String!', this.productId)
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
        const activePrice = new Object(product.prices.find(price => price.currency.label === this.currency.label))
        this.setState({...Object(product), activePrice})
    }
    
    async componentDidMount() {
        await this.fetchData()
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.global.currency.label !== this.props.global.currency.label) {
            this.setState((state) => {
                const activePrice = new Object(state.prices.find(price => price.currency.label === this.props.global.currency.label))
                console.log(activePrice)
                return {...state, activePrice}
            })
        }
    }

    handleSubmit(event) {
        event.preventDefault()
        if(event.target.checkValidity()) {
            const newProduct = createNewProduct(event.target)
            addItem(newProduct)
            document.dispatchEvent(new CustomEvent("minicart:set-open", {
                detail: { open: true }
            }))
            document.dispatchEvent(new CustomEvent("minicart:update"))
        }
    }

    render() {
        const ProductView = styled.div`
            display: grid;
            grid-template-columns: 1fr 5fr 2fr;
            font-family: 'Raleway';
            max-width: 1240px;
            margin: 0 auto;
            grid-gap: 20px;
        `
        const ProductInfo = styled.div`
            padding: 0 100px 0 0;
        `

        return (
            <>
                {this.state && (
                    <ProductView>
                        <ProductGallery gallery={this.state.gallery}></ProductGallery>
                        <ProductInfo>
                            <form onSubmit={this.handleSubmit}>
                                <h1>{this.state.brand}</h1>
                                <h2>{this.state.name}</h2>
                                <h3>{this.state.attributes.map(function (attribute, index) {
                                    return (
                                        <div key={index}>{attribute.name}:
                                        <br></br>
                                            {attribute.items.map(function (item, index) {
                                                return (
                                                    <label key={index} htmlFor={item.id}> 
                                                        <input required value={item.value} id={item.id} name={`attribute.${attribute.name}`}  type="radio"/>
                                                            <div className="radio-tile">
                                                                {item.displayValue}
                                                            </div>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    )
                                })}</h3>
                                <p>PRICE:</p>
                                <h4>{priceFormat(this.state.activePrice.amount, this.props.global.currency.symbol)}</h4>
                                <input name="productId" value={this.productId} type="hidden"/>
                                <div className="cart-adding">
                                    <button>ADD TO CART</button>
                                </div>
                                <p dangerouslySetInnerHTML={{__html: this.state.description}}/>
                            </form>
                        </ProductInfo>
                    </ProductView>
                )}
            </>
        )
    }
}

export default withRouter(ProductPage)
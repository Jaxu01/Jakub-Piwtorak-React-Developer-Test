import { client, Field, Query } from "@tilework/opus"
import { withRouter } from "react-router"
import { Component } from "react"
import ProductGallery from '../components/ProductGallery.js'
import { addItem } from '../actions/minicart.js'
import { createNewProduct } from '../actions/product.js'
import Price from '../components/Price.js'
import '../productpage.css'


class ProductPage extends Component {
    constructor(props) {
        super(props)
        this.state = null
        this.currency = this.props.global.currency
        this.params = ""
    }

    async fetchData() {
        const query = new Query('product', true)
        .addArgument('id', 'String!', this.params.productId)
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
        return (
            <>
                {this.state && (
                    <div className="product-view">
                        <ProductGallery gallery={this.state.gallery}></ProductGallery>
                        <div className="product-info">
                            <form onSubmit={this.handleSubmit}>
                                <h1>{this.state.brand}</h1>
                                <h2>{this.state.name}</h2>
                                <h3>{this.state.attributes.map(function (attribute, index) {
                                    return (
                                        <div key={index}>{attribute.name}:
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
                                <h4><Price price={this.state.activePrice.amount}></Price></h4>
                                <input name="productId" value={this.params.productId} type="hidden"/>
                                <div className="cart-adding">
                                    <button>ADD TO CART</button>
                                </div>
                                <p dangerouslySetInnerHTML={{__html: this.state.description}}/>
                            </form>
                        </div>
                    </div>
                )}
            </>
        )
    }
}

export default withRouter(ProductPage)
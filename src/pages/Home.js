import '../index.css'
import { Component } from "react"
import { client, Field, Query } from "@tilework/opus"
import { Link } from "react-router-dom"
import { withRouter } from "../fallback/react-router.js"
import {ReactComponent as CartLogo} from '../cartIcon.svg'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  
  async fetchData() {
    const listId = this.props.router.params.listId
    const query = new Query('category', true)
      .addArgument('input', 'CategoryInput', { title: listId })
      .addField(new Field('products')
        .addFieldList(['name', 'gallery', 'id'])
        .addField(new Field('prices')
            .addFieldList(['amount'])
            .addField(new Field('currency')
                .addFieldList(['symbol', 'label'])
            )
        )
      )
      const {category} = await client.post(query)
      const refinedCategory = Object(category)
      this.setState({...refinedCategory, products: this.handleActiveCurrencyProducts(category.products)})
  }

  componentDidMount() {
    this.fetchData()
  }

  async componentDidUpdate(prevProps) {
    console.log(1)
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.fetchData()
    }
  }

  handleActiveCurrencyProducts(products) {
    const productList = []
    const { currency } = this.props.global
    products.forEach(product => {
        const activePrice = new Object(product.prices.find(price => price.currency.label === currency.label))
        productList.push ({
          ...product,
          activePrice
        })
    })
    return productList
  }

  render() {
    return (
      <div className="App">
        <main className="product-list">
          {this.state?.products?.map((product, index) => (
            <div className="product-hover" key={index}>
              <Link to={`/product/${product.id}`} className="product-name">
                <img src={product.gallery[0]}></img>
                <div className="circle">
                  <CartLogo className="add-cart white"></CartLogo>
                </div>
                <p>{product.name}</p>
                <p>{product.product}</p>
                <p>{product.activePrice.currency.symbol}{product.activePrice.amount}</p>
              </Link>
            </div>
          ))}
        </main>
      </div>
    )
  }
}

export default withRouter(Home)
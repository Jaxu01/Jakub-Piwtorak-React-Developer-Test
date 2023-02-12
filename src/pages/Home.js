import '../index.css';
import { useState, useEffect } from "react";
import { client, Field, Query } from "@tilework/opus";
import { useOutletContext, Link } from "react-router-dom";
import {ReactComponent as CartLogo} from '../cartIcon.svg';

function Home() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [currency, activeTab] = useOutletContext();



  const fetchData = async() => {
      client.setEndpoint('http://localhost:4000/')
      const query = new Query('category', true)
        .addArgument('input', 'CategoryInput', { title: activeTab })
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
      const refinedCategory = new Object(category)
      setActiveCategory({...refinedCategory, products: handleActiveCurrencyProducts(category.products)})
  }
  useEffect(() => { 
      (async() => {
        await fetchData()
      })()
  }, [currency, activeTab])

  const handleActiveCurrencyProducts = (products) => {
    const productList = []


    products.forEach(product => {
        const activePrice = new Object(product.prices.find(price => price.currency.label === currency.label))
        productList.push({
          ...product,
        activePrice
        })
    })
    return productList
  }

  return (
      <div className="App">
        <main className="product-list">
          {activeCategory?.products?.map((product, index) => (
            <div className="product-hover" key={index}>
              <Link to={product.id} className="product-name">
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
  );
}

export default Home;
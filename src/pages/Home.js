import '../index.css';
import { useState, useEffect } from "react";
import { client, Field, Query } from "@tilework/opus";
import { useOutletContext } from "react-router-dom";

function Home() {
const [activeCategory, setActiveCategory] = useState(null);
const currency = useOutletContext();
console.log(currency)


const fetchData = async() => {
    client.setEndpoint('http://localhost:4000/')
    const query = new Query('category', true)
    .addArgument('input', 'CategoryInput', { title: 'clothes' })
    .addField(new Field('products')
        .addFieldList(['name', 'gallery'])
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
  }, [currency])

  const handleActiveCurrencyProducts = (products) => {
    const productList = []
    products.forEach(product => {
        const activePrice = new Object(product.prices.find(price => price.currency.label === currency.label))
        productList.push({
        activePrice,
        ...product
        })
    })
    return productList
    }

  return (
      <div className="App">
        <main>
          {activeCategory?.products?.map((product, index) => (
            <div key={index} className="product-name">
              <img src={product.gallery[0]}></img>
              <p>{product.name}</p>
              <p>{product.product}</p>
              <p>{product.activePrice.currency.symbol}{product.activePrice.amount}</p>
            </div>
          ))}
        </main>
      </div>
  );
}

export default Home;
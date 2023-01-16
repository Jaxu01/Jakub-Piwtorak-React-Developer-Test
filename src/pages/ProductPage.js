import { useParams } from "react-router-dom";
import { client, Field, Query } from "@tilework/opus";
import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import '../productpage.css'

const parser = new DOMParser();

const ProductPage = () => {
    const [data, setData] = useState(null);
    const param = useParams()
    const currency = useOutletContext();
    const fetchData = async() => {
        const query = new Query('product', true)
        .addArgument('id', 'String!', param.productId)
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
        const activePrice = new Object(product.prices.find(price => price.currency.label === currency.label))
        setData({...Object(product), activePrice})
    }
    console.log(data)
    
    useEffect(() => { 
        (async() => {
            await fetchData()
        })()
    }, [])
    console.log(data)

    return (
        <>
            {data && (
                <div className="product-view">
                    <div className="thumbnails">
                        {data.gallery.map(image => (
                            <img className="images" src={image}/>
                        ))}
                    </div>
                    <div className="featured-picture">
                        <img src={data.gallery[0]}/>
                    </div>
                    <div className="product-info">
                        <h1>{data.brand}</h1>
                        <h2>{data.name}</h2>
                        <h3>{data.attributes.map(function (attribute) {
                            return (
                                <p>{attribute.name}
                                    {attribute.items.map(function (item) {
                                        return (
                                            <>
                                                <label htmlFor={item.id}> 
                                                    <input value={item.value} id={item.id} name={attribute.name} type="radio"/>
                                                        <div className="radio-tile">
                                                            {item.displayValue}
                                                        </div>
                                                </label>
                                            </>
                                        )
                                    })}
                                </p>
                            )
                        })}</h3>
                        <p>PRICE:</p>
                        <h4>{data.activePrice.symbol}{data.activePrice.amount}</h4>
                        <div className="cart-adding">
                            <button>ADD TO CART</button>
                        </div>
                        <div dangerouslySetInnerHTML={{__html: data.description}}/>
                    </div>
                </div>
            )}
        </>
        )
    }

export default ProductPage;
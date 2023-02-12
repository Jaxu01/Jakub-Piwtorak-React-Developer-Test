import { useParams } from "react-router-dom";
import { client, Field, Query } from "@tilework/opus";
import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import ProductGallery from '../components/ProductGallery.js'
import '../productpage.css'

const parser = new DOMParser();

const ProductPage = () => {
    const [data, setData] = useState(null);
    const param = useParams();
    const [currency] = useOutletContext();
    const formRef = useRef(null);
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

    
    useEffect(() => { 
        (async() => {
            await fetchData()
        })()
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault()
        var miniCart = JSON.parse(localStorage.getItem("minicart")) ?? []
        const formData = new FormData(event.target)
        var object = {}
        formData.forEach(function(value, key){
            object[key] = value
        });
        console.log(object)
        localStorage.setItem("minicart", JSON.stringify([...miniCart, object]))
    }

    return (
        <>
            {data && (
                <div className="product-view">
                    <ProductGallery gallery={data.gallery}></ProductGallery>
                    <div className="product-info">
                        <form onSubmit={handleSubmit}>
                            <h1>{data.brand}</h1>
                            <h2>{data.name}</h2>
                            <h3>{data.attributes.map(function (attribute, index) {
                                return (
                                    <div key={index}>{attribute.name}:
                                        {attribute.items.map(function (item, index) {
                                            return (
                                                    <label key={index} htmlFor={item.id}> 
                                                        <input value={item.value} id={item.id} name={attribute.name} type="radio"/>
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
                            <h4>{data.activePrice.currency.symbol}{data.activePrice.amount}</h4>
                            <input name="productId" value={param.productId} type="hidden"/>
                            <div className="cart-adding">
                                <button>ADD TO CART</button>
                            </div>
                        </form>
                        <p dangerouslySetInnerHTML={{__html: data.description}}/>
                    </div>
                </div>
            )}
        </>
        )
    }

export default ProductPage;
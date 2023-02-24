import { useParams } from "react-router-dom";
import { client, Field, Query } from "@tilework/opus";
import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import ProductGallery from '../components/ProductGallery.js'
import '../productpage.css'


const ProductPage = () => {
    const [data, setData] = useState(null);
    const param = useParams();
    const [currency] = useOutletContext();
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

    const findExistingProduct = (miniCart, newItem) => {
        return miniCart.find(product => product.productId === newItem.productId && JSON.stringify(product.attribute) === JSON.stringify(newItem.attribute))
    }

    const createNewProduct = (formElement) => {
        const formData = new FormData(formElement)
        const object = {}
        formData.forEach(function(value, key){
            const [name, name2] = key.split(".")
            if(name2) {
                object[name] = object[name] ?? {}
                object[name][name2] = value
            }
            else {
                object[name] = value
            }
        });
        return object
    }
    const saveNewItem = (miniCart, newProduct) => {
        const existingProduct = findExistingProduct(miniCart, newProduct)
        let itemToStore = []
        if(existingProduct) {
            itemToStore = miniCart.map(item => {
                if(JSON.stringify(item) === JSON.stringify(existingProduct)) {
                    item.amount++
                }
                return item
            })
        }
        else {
            newProduct.amount = 1
            itemToStore = [...miniCart, newProduct]
        }
        localStorage.setItem("minicart", JSON.stringify(itemToStore))
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        if(event.target.checkValidity()) {
            const miniCart = JSON.parse(localStorage.getItem("minicart")) ?? []
            const newProduct = createNewProduct(event.target)
            saveNewItem(miniCart, newProduct)
            document.dispatchEvent(new CustomEvent("minicart:set-open", {
                detail: { open: true }
            }))
        }
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
                            <h4>{data.activePrice.currency.symbol}{data.activePrice.amount}</h4>
                            <input name="productId" value={param.productId} type="hidden"/>
                            <div className="cart-adding">
                                <button>ADD TO CART</button>
                            </div>
                            <p dangerouslySetInnerHTML={{__html: data.description}}/>
                        </form>
                    </div>
                </div>
            )}
        </>
        )
    }

export default ProductPage;
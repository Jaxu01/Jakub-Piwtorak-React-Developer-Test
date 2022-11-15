import { useParams } from "react-router-dom";
import { client, Field, Query } from "@tilework/opus";
import { useState, useEffect } from "react";



//{productId: 'jacket-canada-goosee'}
const ProductPage = () => {
    const [data, setData] = useState(null);
    const param = useParams()
    const fetchData = async() => {
        const query = new Query('product', true)
        .addArgument('id', 'String!', param.productId)
        .addFieldList(['name', 'gallery', 'description', 'brand'])
        .addField(new Field('prices')
            .addFieldList(['amount'])
        )
        .addField(new Field('attributes')
            .addFieldList(['id', 'name', 'type'])
            .addField(new Field('items')
                .addFieldList(['displayValue', 'value', 'id']) 
            )
        )
        const {product} = await client.post(query)
        setData(product)
    }
    console.log(data)
    
    useEffect(() => { 
        (async() => {
            await fetchData()
        })()
    }, [])
    return (
        <>
            {data && (
                <div className="product-view">
                    {data.gallery.map(image => (
                        <img className="images" src={image}/>
                        ))}
                    <h1>{data.brand}</h1>
                    <h2>{data.name}</h2>
                    <p>{data.activePrice.symbol}{data.activePrice.amount}</p>
                </div>
            )}
        </>
        )
    }

export default ProductPage;
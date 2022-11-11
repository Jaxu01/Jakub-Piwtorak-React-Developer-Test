import { useParams } from "react-router-dom";
import { client, Field, Query } from "@tilework/opus";
import { useState, useEffect } from "react";



//{productId: 'jacket-canada-goosee'}
const ProductPage = () => {
    const [data, setData] = useState(null);
    const param = useParams()
    const fetchData = async() => {
        client.setEndpoint('http://localhost:4000/')
        const query = new Query('product', true)
        .addArgument('id', 'String!', param.productId)
            .addFieldList(['name', 'gallery'])
        .addField(new Field('prices')
            .addFieldList(['amount'])
        .addField(new Field('currency')
            .addFieldList(['symbol', 'label'])
            )
        )
        const product = await client.post(query)
        setData(product.product)
    }
    console.log(data)
    
    useEffect(() => { 
        (async() => {
            await fetchData()
        })()
    }, [])
    return (
        <>
            {data && (<div>{data.name}
            {data.gallery.map(image => (
                <img src={image}/>
            ))
            }</div>)}
        </>
        )
    }

export default ProductPage;
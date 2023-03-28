import { useState } from "react"

const ProductGallery = ({gallery}) => {
    const [featuredImage, setFeaturedImage] = useState(gallery[0])
    return (
        <>
            <div className="thumbnails">
                {gallery.map((image, index) => (
                    <img key={index} className="images" onClick={() => setFeaturedImage(image)} src={image}/>
                ))}
            </div>
            <div className="featured-picture">
                <img src={featuredImage}/>
            </div>
        </>
    )
}

export default ProductGallery
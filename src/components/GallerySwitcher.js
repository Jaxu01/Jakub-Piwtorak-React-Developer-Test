import { useState } from "react"
import "./GallerySwitcher.css"

const GallerySwitcher = ({gallery}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    console.log(currentIndex)

    const isFirstImage = currentIndex === 0
    const isLastImage = currentIndex === gallery.length - 1
    return (
        <>
            <div className="picture-switches">
                <p className={`left-switch ${isFirstImage && "disabled"}`} onClick={() => setCurrentIndex(prev => prev - 1)}></p>
                <p className={`right-switch ${isLastImage && "disabled"}`} onClick={() => setCurrentIndex(prev => prev + 1)}></p>
            </div>
            <div className="featured-picture">
                <img src={gallery[currentIndex]}/>
            </div>
        </>
    )
}

export default GallerySwitcher
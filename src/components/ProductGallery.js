import { Component } from "react"

class ProductGallery extends Component {
    constructor(props) {
        super(props)
        this.state = {featuredImage: this.props.gallery[0]}
    }

    render() {
        const { gallery } = this.props
        return (
            <>
                <div className="thumbnails">
                    {gallery?.map((image, index) => (
                        <img key={index} className="images" onClick={() => this.setState({featuredImage: image})} src={image}/>
                    ))}
                </div>
                <div className="featured-picture">
                    <img src={this.state.featuredImage}/>
                </div>
            </>
        )
    }
}

export default ProductGallery
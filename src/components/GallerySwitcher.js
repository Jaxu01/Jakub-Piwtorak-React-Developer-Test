import { Component } from "react"
import "./GallerySwitcher.css"

export class GallerySwitcher extends Component {
    constructor(props) {
        super(props)
        this.state = {galleryIndex: 0}
    }
    
    render () {
        this.isFirstImage = this.state.galleryIndex === 0
        this.isLastImage = this.state.galleryIndex === this.props.gallery.length - 1
        return (
            <>
                <div className="picture-switches">
                    <p className={`left-switch ${this.isFirstImage && "disabled"}`} onClick={() => this.setState(state => ({galleryIndex: state.galleryIndex - 1}))}></p>
                    <p className={`right-switch ${this.isLastImage && "disabled"}`} onClick={() => this.setState(state => ({galleryIndex: state.galleryIndex + 1}))}></p>
                </div>
                <div className="featured-picture">
                    <img src={this.props.gallery[this.state.galleryIndex]}/>
                </div>
            </>
        )
    }
}

export default GallerySwitcher
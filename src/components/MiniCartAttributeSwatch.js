import { Component } from "react"

class MiniCartAttributeSwatch extends Component {
    
    render() {
        const { items, choice, className } = this.props
        return (
            <div>
                {items.map((item, index) => (
                    <label key={index} htmlFor={item.id} style={{backgroundColor: item.value}}> 
                            <div className={`${className} ${choice === item.value ? "minicart-swatch-tile-active" : "minicart-swatch-tile"}`}>
                            </div>
                    </label>
                ))}
            </div>
        )
    }
}

export default MiniCartAttributeSwatch
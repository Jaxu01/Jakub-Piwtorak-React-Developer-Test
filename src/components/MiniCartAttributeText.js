import { Component } from "react"

class MiniCartAttributeText extends Component {
    
    render() {
        const { items, choice, type, className } = this.props
        return (
            <div>
                {items.map((item, index) => (
                    <label key={index} htmlFor={item.id} style={{backgroundColor: item.value}}> 
                        <div className={`${className} ${choice === item.value ? "minicart-radio-tile-active" : "minicart-radio-tile"}`}>
                            {type !== "swatch" && item.value}
                        </div>
                    </label>
                ))}
            </div>
        )
    }
}

export default MiniCartAttributeText
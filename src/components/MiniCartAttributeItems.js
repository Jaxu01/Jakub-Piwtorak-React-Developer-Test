// import './MiniCartAttributeItems.css';

const MiniCartAttributeItems = ({items, choice, type}) => {
    
    return (
        <div>
            {items.map((item, index) => (
                <label key={index} htmlFor={item.id} style={{backgroundColor: item.value}}> 
                        <div className={`${choice === item.value ? "minicart-radio-tile-active" : "minicart-radio-tile"}`}>
                            {type !== "swatch" && item.value}
                        </div>
                </label>
            ))}
        </div>
    )
}

export default MiniCartAttributeItems;
import { Component } from "react"
import { Query, client } from '@tilework/opus'
import { ReactComponent as DropdownLogo} from "../dropdown.svg"
import Dropdown from "./Dropdown.js"
import "./Currencies.css"

class Currencies extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currencies: []
        }
        this.changeCurrency = this.changeCurrency.bind(this)
    }

    async componentDidMount() {
        client.setEndpoint('http://localhost:4000/')
        const query = new Query('currencies', true)
        .addFieldList(['label', 'symbol'])
        
        const result = await client.post(query)
        this.setState({currencies: result.currencies})
    }

    changeCurrency(currency) {
        document.dispatchEvent(new CustomEvent("update-global", {detail: {currency}}))
    }
    
    render() {
        const { symbol } = this.props.activeCurrency
        const DropdownTitle = () => (
            <div>
                {symbol}
                <DropdownLogo/>
            </div>
        )
        return (
            <Dropdown className="currencies-dropdown" title={<DropdownTitle/>}>
                <div className="section-right-currencies">
                    <div className="currencies-container">
                        {this.state.currencies?.map((currency, index) => (
                            <div key={index} onMouseOver={() => this.changeCurrency(currency)} onClick={() => this.changeCurrency(currency)} className="currency-div">
                                <p>{currency.symbol}</p>
                                <p>{currency.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Dropdown>
        )
    }
}

export default Currencies
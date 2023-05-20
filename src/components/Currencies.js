import { Component } from "react"
import { Query, client } from '@tilework/opus'
import { ReactComponent as DropdownLogo} from "../dropdown.svg"
import Dropdown from "./Dropdown.js"
import styled from "styled-components"
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
        const SectionRightCurrencies = styled.div`
            box-shadow: 0px 4px 35px 0px rgba(168, 172, 176, 0.19);
            z-index: 1;
        `
        const CurrencyDiv = styled.div`
            display: flex;
            gap: 10px;
            padding: 0px 15px;
            transition: all 255ms;
            &:hover {
                background-color: #EEEEEE;
                cursor: pointer;
            }
        `
        return (
            <Dropdown className="currencies-dropdown" title={<DropdownTitle/>}>
                <SectionRightCurrencies>
                    <div className="currencies-container">
                        {this.state.currencies?.map((currency, index) => (
                            <CurrencyDiv key={index} onClick={() => this.changeCurrency(currency)}>
                                <p>{currency.symbol}</p>
                                <p>{currency.label}</p>
                            </CurrencyDiv>
                        ))}
                    </div>
                </SectionRightCurrencies>
            </Dropdown>
        )
    }
}

export default Currencies
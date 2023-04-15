import '../index.css'
import { Component } from "react"
import { Outlet } from "react-router-dom"
import Navigation from '../components/Navigation.js'
import Currencies from "../components/Currencies.js"
import MiniCart from '../components/MiniCart.js'


class Layout extends Component {
    constructor(props) {
        super(props)
        this.state = {activeTab: null}
    }

    handleChange(newActiveTab) {
        document.dispatchEvent(new CustomEvent("update-global", {detail: {activeTab: newActiveTab}}))
    }
    
    render() {
        return (
                <div className="App">
                    <header className="desktop">
                        <Navigation
                            currencyDropdown={
                                <Currencies
                                    activeCurrency={this.props.global.currency}
                                />
                            }
                            minicart={<MiniCart activeCurrency={this.props.global.currency}></MiniCart>}
                            activeTab={this.state.activeTab}
                            handleChange={this.handleChange}
                        />
                    </header>
                    <Outlet context={ this.state.activeTab }/>
                </div>
        )
    }
}

export default Layout
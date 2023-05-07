import '../index.css'
import { Component } from "react"
import Navigation from '../components/Navigation.js'
import Currencies from "../components/Currencies.js"
import MiniCart from '../components/MiniCart.js'
import { getItems, setItems } from '../actions/global.js'


class Layout extends Component {
  constructor(props) {
    super(props)
    this.state = getItems()
  }

  componentDidMount() {
    document.addEventListener("update-global", ({detail}) => {
      this.setState((state) => {
        const newState = {...state, ...detail}
        setItems(newState)
        return newState
      })
    })
  }

  render() {
    const Pagecomponent = this.props.component
    return (
      <div className="App">
        <header className="desktop">
          <Navigation
            currencyDropdown={
              <Currencies
                activeCurrency={this.state.currency}
              />
            }
            minicart={<MiniCart activeCurrency={this.state.currency}></MiniCart>}
          />
        </header>
        <Pagecomponent global={ this.state }/>
      </div>
    )
  }
}

export default Layout
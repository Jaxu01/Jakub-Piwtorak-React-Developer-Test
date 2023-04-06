import { Component } from "react"
import { client, Query } from "@tilework/opus"
import {ReactComponent as ReactLogo} from '../logo.svg'
import MiniCart from '../components/MiniCart.js'

class Navigation extends Component {
    constructor(props) {
        super(props)
        this.state = {categoryTabs: null}
    }
    
    async componentDidMount() {
        const query = new Query('categories', true)
            .addFieldList(['name'])
        const {categories} = await client.post(query)
        this.setState({categoryTabs: categories})
    }

    render () {
        const { handleChange, activeTab, currencyDropdown } = this.props
        return (
            <nav className="navigation">
                <div className="section-left">
                    {this.state.categoryTabs?.map((category, index) => (
                        <button 
                            className={category.name === activeTab ? 'active tab-button' : 'tab-button'}
                            onClick={() => handleChange(category.name)} 
                            key={index}>
                            {category.name}
                        </button>
                    ))}
                </div>
                <div className="section-middle">
                    <ReactLogo></ReactLogo>
                </div>
                <div className="section-right">
                    {currencyDropdown}
                    <MiniCart></MiniCart>
                </div>
            </nav>
        )
    }    
}

export default Navigation
import { Component } from "react"
import { client, Query } from "@tilework/opus"
import {ReactComponent as ReactLogo} from '../logo.svg'

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

    handleChange(newActiveTab) {
        document.dispatchEvent(new CustomEvent("update-global", {detail: {activeTab: newActiveTab}}))
    }

    render () {
        const { activeTab, currencyDropdown, minicart } = this.props
        return (
            <nav className="navigation">
                <div className="section-left">
                    {this.state.categoryTabs?.map((category, index) => (
                        <button 
                            className={category.name === activeTab ? 'active tab-button' : 'tab-button'}
                            onClick={() => this.handleChange(category.name)}
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
                    {minicart}
                </div>
            </nav>
        )
    }    
}

export default Navigation
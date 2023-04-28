import { Component } from "react"
import { client, Query } from "@tilework/opus"
import { NavLink } from "react-router-dom";
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

    render () {
        const { currencyDropdown, minicart } = this.props
        return (
            <nav className="navigation">
                <div className="section-left">
                    {this.state.categoryTabs?.map((category, index) => (
                        <NavLink
                            className={({isActive}) => isActive ? 'active tab-button' : 'tab-button'}
                            to={`/${category.name}`}
                            key={index}>
                            {category.name}
                        </NavLink>
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
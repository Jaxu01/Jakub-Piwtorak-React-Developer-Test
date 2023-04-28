import { Component } from "react"
import './Dropdown.css'

class Dropdown extends Component {
  constructor(props) {
    super(props)
    this.state = { dropdownOpen: false }
  }

  componentDidMount() {
    const { dispatchEvent } = this.props
    dispatchEvent &&
      document.addEventListener(dispatchEvent, ({ detail }) => {
        this.setState({ dropdownOpen: detail.open })
      })
  }

  render() {
    const { children, title, className } = this.props
    const { dropdownOpen } = this.state
    return (
      <div className={`dropdown ${className ? className : ""}`}>
        <div className="dropdown-title" onClick={() => this.setState((state) => ({ dropdownOpen: !state.dropdownOpen }))}>
          {title}
        </div>
        {dropdownOpen && (
          <div className="dropdown-content" >{children}</div>
        )}
      </div>
    )
  }
}

export default Dropdown
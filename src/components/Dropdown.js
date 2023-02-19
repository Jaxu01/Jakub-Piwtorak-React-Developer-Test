import { useState, useEffect } from "react";
import './Dropdown.css';

const Dropdown = ({children, title, dispatchEvent}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

     useEffect(() => {
        dispatchEvent && document.addEventListener(dispatchEvent, ({detail}) => {
            setDropdownOpen(detail.open)
        })
    }, [])

    return (
        <div className="dropdown">
            <div className="dropdown-title" onClick={() => setDropdownOpen(prev => !prev)}>{title}</div>
            
            {dropdownOpen && (
                <>
                    <div className="dropdown-content">{children}</div>
                </>        
            )}
        </div>
    )
}

export default Dropdown;
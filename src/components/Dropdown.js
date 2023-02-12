import { useState } from "react";
import './Dropdown.css';

const Dropdown = ({children, title}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
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
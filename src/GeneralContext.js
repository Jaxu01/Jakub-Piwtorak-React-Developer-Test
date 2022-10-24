import { useState, useContext, createContext } from "react";
const GeneralUpdateContext = createContext()
const GeneralContext = createContext()
export function useGeneral() {
    return useContext(GeneralContext)
}
export function useGeneralUpdate() {
    return useContext(GeneralUpdateContext)
}
export function GeneralProvider({ children }) {
    const [state, setState] = useState({
        activeCurrency: {symbol : "$"}
    })
    function updateGeneral(obj) {
        console.log(obj)
        setState({...state, ...obj})
    }
    return (
        <GeneralContext.Provider value={setState}>
            <GeneralUpdateContext.Provider value={updateGeneral}>
                {children}
            </GeneralUpdateContext.Provider>
        </GeneralContext.Provider>
    )
}

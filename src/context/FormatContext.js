import { createContext } from 'react'

const FormatContext = createContext({})

const FormatProvider = ({ children }) => {

    const values = {
        name: "jonatan"
    }

    return <FormatContext.Provider value={values}>{children}</FormatContext.Provider>
}

export { FormatContext, FormatProvider }

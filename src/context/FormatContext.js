import { createContext, useState } from 'react'

const FormatContext = createContext({})

const FormatProvider = ({ children }) => {
    const [title, setTitle] = useState('Home')

    const values = {
        title,
        setTitle
    }

    return <FormatContext.Provider value={values}>{children}</FormatContext.Provider>
}

export { FormatContext, FormatProvider }

import { createContext, useState } from 'react'

const ParametersContext = createContext({})

const ParametersProvider = ({ children }) => {
    const [title, setTitle] = useState('Home')

    const values = {
        title,
        setTitle
    }

    return <ParametersContext.Provider value={values}>{children}</ParametersContext.Provider>
}

export { ParametersContext, ParametersProvider }

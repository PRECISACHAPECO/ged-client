import { createContext, useState } from 'react'
const RouteContext = createContext({})

const RouteProvider = ({ children }) => {
    const [id, setId] = useState(null)
    const values = { id, setId }
    return <RouteContext.Provider value={values}>{children}</RouteContext.Provider>
}

export { RouteContext, RouteProvider }

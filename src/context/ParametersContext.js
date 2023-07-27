import { createContext, useState } from 'react'
<<<<<<< HEAD

=======
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b

const ParametersContext = createContext({})

const ParametersProvider = ({ children }) => {
    const [title, setTitle] = useState('Home')

    const values = {
        title,
<<<<<<< HEAD
        setTitle,
        handleSearch,
        pageSize,
        setPageSize,
        searchText,
        setSearchText,
        filteredData,
        setFilteredData,
        data,
        setData,
        setStorageId,
        getStorageId
=======
        setTitle
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
    }

    return <ParametersContext.Provider value={values}>{children}</ParametersContext.Provider>
}

export { ParametersContext, ParametersProvider }

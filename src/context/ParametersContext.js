import { createContext, useState, useEffect } from 'react'

const ParametersContext = createContext({})

const ParametersProvider = ({ children }) => {
    const [title, setTitle] = useState('Home')
    const [filteredData, setFilteredData] = useState([])
    const [searchText, setSearchText] = useState('')

    const [rows, setRows] = useState([])
    const [data] = useState(rows)
    const [pageSize, setPageSize] = useState(10)

    const handleTableSearch = searchValue => {
        setSearchText(searchValue)
        const searchWords = searchValue.toLowerCase().split(' ').filter(word => word !== '')

        const filteredRows = data.filter(row => {
            return searchWords.every(word => {
                return Object.keys(row).some(field => {
                    return row[field].toString().toLowerCase().indexOf(word) !== -1
                })
            })
        })

        if (searchValue.length && filteredRows.length > 0) {
            setFilteredData(filteredRows)
        } else {
            setFilteredData([])
        }
    }


    const values = {
        handleSearch: handleTableSearch,
        setFilteredData,
        filteredData,
        setSearchText,
        searchText,
        setRows,
        pageSize,
        setPageSize,
        data,

        title,
        setTitle,
    }

    return <ParametersContext.Provider value={values}>{children}</ParametersContext.Provider>
}

export { ParametersContext, ParametersProvider }

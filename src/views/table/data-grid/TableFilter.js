// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, ptBR } from '@mui/x-data-grid'

import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'

const escapeRegExp = value => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

}

const TableColumns = ({ title, rows, columns }) => {
    // ** States
    const [data] = useState(rows)
    const [pageSize, setPageSize] = useState(10)
    const [searchText, setSearchText] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const handleSearch = searchValue => {
        setSearchText(searchValue)
        const searchWords = searchValue.toLowerCase().split(' ').filter(word => word !== '')
        
        const filteredRows = data.filter(row => {
            return searchWords.every(word => {
                return Object.keys(row).some(field => {
                    return row[field].toString().toLowerCase().indexOf(word) !== -1
                })
            })
        })
        console.log('num caract: ', searchText.length)

        if (searchValue.length && filteredRows.length > 0) {
            setFilteredData(filteredRows)
        } else {
            setFilteredData([])
        }
    }


    return (
        <DataGrid
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            autoHeight
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 20, 30, 40, 50, 100]}
            components={{ Toolbar: QuickSearchToolbar }}
            rows={searchText ? filteredData : data}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            componentsProps={{
                baseButton: {
                    variant: 'outlined'
                },
                toolbar: {
                    value: searchText,
                    clearSearch: () => handleSearch(''),
                    onChange: event => handleSearch(event.target.value)
                }
            }}
        />
    )
}

export default TableColumns

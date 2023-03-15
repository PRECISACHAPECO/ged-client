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
    const [pageSize, setPageSize] = useState(7)
    const [searchText, setSearchText] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const handleSearch = searchValue => {
        setSearchText(searchValue)
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')

        const filteredRows = data.filter(row => {
            return Object.keys(row).some(field => {
                // @ts-ignore
                return searchRegex.test(row[field].toString())
            })
        })
        if (searchValue.length) {
            setFilteredData(filteredRows)
        } else {
            setFilteredData([])
        }
    }

    return (
        <Card>
            <CardHeader title={title} />
            <DataGrid
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                autoHeight
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[20, 30, 40, 50, 100, 200]}
                components={{ Toolbar: QuickSearchToolbar }}
                rows={filteredData.length ? filteredData : data}
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
        </Card>
    )
}

export default TableColumns

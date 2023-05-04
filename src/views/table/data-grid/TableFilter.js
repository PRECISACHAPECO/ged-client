// ** React Imports
import { useState } from 'react'

// ** Next
import { useRouter } from 'next/router'

// ** MUI Imports
import { DataGrid, ptBR } from '@mui/x-data-grid'

import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'

const escapeRegExp = value => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const TableColumns = ({ rows, columns, buttonsHeader }) => {

    // ** States
    const [data] = useState(rows)
    const [pageSize, setPageSize] = useState(10)
    const [searchText, setSearchText] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const router = useRouter()
    const currentLink = router.pathname

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
            onRowClick={row => router.push(`${currentLink}/${row.row.id}`)}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            sx={{ '& .MuiDataGrid-cell': { cursor: 'pointer' } }}
            componentsProps={{
                // baseButton: {
                //     variant: 'outlined',
                //     size: '36px'
                // },
                toolbar: {
                    value: searchText,
                    clearSearch: () => handleSearch(''),
                    onChange: event => handleSearch(event.target.value),
                    buttonsHeader: buttonsHeader
                }
            }}
        />
    )
}

export default TableColumns

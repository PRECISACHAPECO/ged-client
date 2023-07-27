<<<<<<< HEAD
import { useContext } from 'react'
=======
// ** React Imports
import { useState } from 'react'

// ** Next
import { useRouter } from 'next/router'

// ** MUI Imports
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
import { DataGrid, ptBR } from '@mui/x-data-grid'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
<<<<<<< HEAD
import { ParametersContext } from 'src/context/ParametersContext'
import { RouteContext } from 'src/context/RouteContext'

const TableFilter = ({ rows, columns, buttonsHeader }) => {
    const {
        handleSearch,
        pageSize,
        setPageSize,
        searchText,
        filteredData,
        setData,
        data
    } = useContext(ParametersContext)
=======

const escapeRegExp = value => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const TableColumns = ({ rows, columns, buttonsHeader }) => {
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b

    const { setId } = useContext(RouteContext)

    // ** States
    const [data] = useState(rows)
    const [pageSize, setPageSize] = useState(10)
    const [searchText, setSearchText] = useState('')
    const [filteredData, setFilteredData] = useState([])

<<<<<<< HEAD
=======
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

>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
    return (
        <DataGrid
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            autoHeight
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 20, 30, 40, 50, 100]}
            components={{ Toolbar: QuickSearchToolbar }}
            rows={searchText ? filteredData : data}
            onCellClick={(params, event) => {
                setId(params.row.id)
            }}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
<<<<<<< HEAD
            sx={{
                '& .MuiDataGrid-cell': { cursor: 'pointer' }
            }}
=======
            sx={{ '& .MuiDataGrid-cell': { cursor: 'pointer' } }}
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
            componentsProps={{
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

export default TableFilter

// ** React Imports
import { useState, useContext } from 'react'

import { red, yellow, green, indigo, orange } from '@mui/material/colors';


// ** Next
import { useRouter } from 'next/router'

// ** MUI Imports
import { DataGrid, ptBR } from '@mui/x-data-grid'

import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'

const escapeRegExp = value => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

import { ParametersContext } from 'src/context/ParametersContext'

const TableColumns = ({ rows, columns, buttonsHeader }) => {
    const {
        handleSearch,
        pageSize,
        setPageSize,
        searchText,
        filteredData,
        setData,
        data
    } = useContext(ParametersContext)

    // ** States
    setData(rows)

    const router = useRouter()
    const currentLink = router.pathname

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

            sx={{
                '& .MuiDataGrid-cell': { cursor: 'pointer' }
            }}
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

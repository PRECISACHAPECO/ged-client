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

const TableColumns = ({ rows, columns, buttonsHeader, rowColors }) => {
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

            getRowClassName={(params) => {
                if (rowColors) {
                    const row = params.row;
                    let rowColor = '';
                    //* Cores para o fornecedor
                    if (row.status == '10' || row.status == '20' || row.status == '30') { // Fornecedor preenchendo
                        rowColor = 'warning-row';
                    } else if (row.status == '40') { // Fornecedor concluiu o preenchimento (aguardando)
                        rowColor = 'primary-row';
                    } else if (row.status == '50') { // Fábrica reprovou
                        rowColor = 'error-row';
                    } else if (row.status == '60') { // Fábrica aprovou parcialmente
                        rowColor = 'secondary-row';
                    } else if (row.status == '70') { // Fábrica aprovou
                        rowColor = 'success-row';
                    }
                    return rowColor;
                }
            }}

            sx={{
                '& .error-row': {
                    backgroundColor: red[200],
                    '&:hover': {
                        backgroundColor: red[300],
                    }
                },
                '& .warning-row': {
                    backgroundColor: orange[200],
                    '&:hover': {
                        backgroundColor: orange[300],
                    }
                },
                '& .success-row': {
                    backgroundColor: green[300],
                    '&:hover': {
                        backgroundColor: green[400],
                    }
                },
                '& .primary-row': {
                    backgroundColor: indigo[200],
                    '&:hover': {
                        backgroundColor: indigo[300],
                    }
                },
                '& .secondary-row': {
                    backgroundColor: green[100],
                    '&:hover': {
                        backgroundColor: green[200],
                    }
                },
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

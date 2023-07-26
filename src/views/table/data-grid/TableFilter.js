import { useContext } from 'react'
import { DataGrid, ptBR } from '@mui/x-data-grid'
import QuickSearchToolbar from 'src/views/table/data-grid/QuickSearchToolbar'
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

    const { setId } = useContext(RouteContext)

    // ** States
    setData(rows)

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
            sx={{
                '& .MuiDataGrid-cell': { cursor: 'pointer' }
            }}
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

import { Card, CardContent } from '@mui/material'
import TableFilter from 'src/views/table/data-grid/TableFilter'

const Table = ({ result, columns }) => {
    return (
        <Card>
            <CardContent sx={{ pt: '0' }}>
                <TableFilter
                    rows={result}
                    columns={columns}
                    buttonsHeader={{
                        btnNew: true,
                        btnPrint: true
                    }}
                />
            </CardContent>
        </Card>
    )
}

export default Table

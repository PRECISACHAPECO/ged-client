
// ** Material UI
import { Typography } from '@mui/material'

// ** Next
import Link from 'next/link'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// Status Default
const statusDefault = {
    1: { title: 'Ativo', color: 'success' },
    0: { title: 'Inativo', color: 'secondary' },
}

const configColumns = (currentLink, arrColumns) => {

    return arrColumns.map((column, i) => {
        const currentColumns = arrColumns[i].field

        return {
            ...column,
            flex: column.size,
            renderCell: params => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    <Link href={`${currentLink}/${params.row.id}`}>
                        {arrColumns &&
                            arrColumns.map((c, j) => {
                                if (c.field === currentColumns) {
                                    // Encotrou a coluna
                                    if (c.field == 'status') {
                                        const status = statusDefault[params.row.status]

                                        return (
                                            <CustomChip
                                                key={j}
                                                size='small'
                                                skin='light'
                                                color={status.color}
                                                label={status.title}
                                                sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
                                            />
                                        )
                                    } else {
                                        return params.row[c.field]
                                    }
                                }
                            })}
                    </Link>
                </Typography>
            )
        }
    })
}

export { configColumns, statusDefault }


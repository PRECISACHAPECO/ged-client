// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { GridToolbarFilterButton } from '@mui/x-data-grid'
import ListHeader from 'src/components/Defaults/ListHeader'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const QuickSearchToolbar = (props) => {

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                p: theme => theme.spacing(8, 0, 0, 0),
            }}
        >
            <Box sx={{ display: 'flex', gap: '8px', textAlig: "end" }}>
                <TextField
                    size='medium'
                    value={props.value}
                    onChange={props.onChange}
                    placeholder='Buscar…'
                    variant='standard'
                    InputProps={{
                        startAdornment: (
                            <Box sx={{ mr: 2, display: 'flex' }}>
                                <Icon icon='mdi:magnify' fontSize={20} />
                            </Box>
                        ),
                        endAdornment: (
                            <IconButton size='medium' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
                                <Icon icon='mdi:close' fontSize={20} />
                            </IconButton>
                        )
                    }}
                    sx={{
                        width: {
                            xs: 1,
                            sm: 'auto'
                        },
                        '& .MuiInputBase-root > svg': {
                            mr: 2
                        }
                    }}
                />
                <GridToolbarFilterButton />
            </Box>

            <Box>
                <ListHeader
                    btnNew={props.buttonsHeader.btnNew}
                    btnPrint={props.buttonsHeader.btnPrint}
                    openModal={props.buttonsHeader.openModal}
                />
            </Box>
        </Box>
    )
}

export default QuickSearchToolbar

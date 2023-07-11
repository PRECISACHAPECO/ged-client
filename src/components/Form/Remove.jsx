import { Grid, Typography, Box, FormControlLabel, Checkbox, Tooltip, IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'

const Remove = ({ xs, md, title, removeItem, item, pending, index, textSuccess, textError }) => {
    //* Mensagens tooltip
    textSuccess = textSuccess || 'Remover este item'
    textError = textError || 'Este item não pode ser removido pois possui cadastros vinculados a ele'

    return (
        <Grid item xs={xs} md={md}>
            <Box height='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                <Typography variant='caption'>{title}</Typography>
                <Tooltip title={pending == 1 ? textError : textSuccess}>
                    <IconButton
                        color='error'
                        onClick={() => {
                            pending != 1 ? removeItem(item, index) : null
                        }}
                        sx={{
                            opacity: pending == 1 ? 0.5 : 1,
                            cursor: pending == 1 ? 'default' : 'pointer'
                        }}
                    >
                        <Icon icon='tabler:trash-filled' />
                    </IconButton>
                </Tooltip>
            </Box>
        </Grid>
    )
}

export default Remove

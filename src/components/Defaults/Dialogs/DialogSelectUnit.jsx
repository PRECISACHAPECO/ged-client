import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Icon from 'src/@core/components/icon'

const DialogSelectUnit = ({ handleClose, openModal, handleSubmit, unidades, setSelectedUnit }) => {
    return (
        <Dialog open={openModal} onClose={handleClose} aria-labelledby='form-dialog-title'>
            <DialogTitle id='form-dialog-title'>Selecione uma unidade</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <Autocomplete
                        options={unidades}
                        getOptionLabel={unit => unit.nomeFantasia}
                        onChange={(event, newValue) => {
                            setSelectedUnit(newValue)
                        }}
                        renderInput={params => <TextField {...params} label='Selecione uma unidade' />}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions className='dialog-actions-dense'>
                <Button
                    variant='outlined'
                    color='primary'
                    startIcon={<Icon icon='material-symbols:cancel' />}
                    onClick={handleClose}
                >
                    Cancelar
                </Button>
                <Button
                    variant='outlined'
                    color='error'
                    startIcon={<Icon icon='line-md:circle-to-confirm-circle-transition' />}
                    onClick={handleSubmit}
                >
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogSelectUnit

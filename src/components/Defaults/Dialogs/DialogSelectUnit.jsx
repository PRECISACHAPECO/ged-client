import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    TextField,
    DialogContentText
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'

const DialogSelectUnit = ({ handleClose, openModal, handleSubmit, unidades, setSelectedUnit }) => {
    return (
        <>
            <Dialog open={openModal} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Selecione a Unidade</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>
                        Selecione uma unidade e clique em Confirmar para continuar.
                    </DialogContentText>
                    <FormControl fullWidth>
                        <Autocomplete
                            options={unidades}
                            getOptionLabel={unit => unit.nomeFantasia + ' [' + unit.papel + ']'}
                            onChange={(event, newValue) => {
                                setSelectedUnit(newValue)
                            }}
                            renderInput={params => <TextField {...params} label='Selecione uma unidade' />}
                        />
                    </FormControl>
                </DialogContent>

                <DialogActions className='dialog-actions-dense' sx={{ mx: 2, mb: 2 }}>
                    <Button variant='outlined' onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant='contained' onClick={handleSubmit}>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogSelectUnit

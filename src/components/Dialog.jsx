// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

const DialogForm = ({ title, text, handleClose, openModal, handleSubmit, btnCancelar, btnConfirmar }) => {
    return (
        <Fragment>
            <Dialog open={openModal} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>{text}</DialogContentText>
                </DialogContent>
                <DialogActions className='dialog-actions-dense'>
                    {btnCancelar && (
                        <Button variant='outlined' color='error' onClick={handleClose}>
                            Cancelar
                        </Button>
                    )}
                    {btnConfirmar && (
                        <Button variant='outlined' color='primary' onClick={handleSubmit}>
                            Salvar
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

export default DialogForm

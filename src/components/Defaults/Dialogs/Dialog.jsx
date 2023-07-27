import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Icon from 'src/@core/components/icon'

const DialogForm = ({ title, text, handleClose, openModal, handleSubmit, btnCancel, btnConfirm }) => {
    return (
        <>
            <Dialog open={openModal} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>{text}</DialogContentText>
                </DialogContent>
                <DialogActions className='dialog-actions-dense'>
                    {btnCancel && (
                        <Button
                            variant='outlined'
                            color='primary'
                            startIcon={<Icon icon='material-symbols:cancel' />}
                            onClick={handleClose}
                        >
                            Cancelar
                        </Button>
                    )}
                    {btnConfirm && (
                        <Button
                            variant='outlined'
                            color='error'
                            startIcon={<Icon icon='line-md:circle-to-confirm-circle-transition' />}
                            onClick={handleSubmit}
                        >
                            Confirmar
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogForm

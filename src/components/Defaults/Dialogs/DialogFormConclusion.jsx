import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { AuthContext } from 'src/context/AuthContext'
import Icon from 'src/@core/components/icon'
import {
    Alert,
    Box,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from '@mui/material'
import { useState, useContext } from 'react'
import { validationEmail } from '../../../configs/validations'

//* Default Form Components
import Result from 'src/components/Defaults/Formularios/Result'

const DialogFormConclusion = ({
    title,
    text,
    handleClose,
    openModal,
    conclusionForm,
    info,
    btnCancel,
    btnConfirm,
    listErrors
}) => {
    const { user, loggedUnity } = useContext(AuthContext)
    const [result, setResult] = useState({})

    console.log('🚀 ~ papelID:', user.papelID)
    console.log('🚀 ~ openModal:', openModal)
    return (
        <>
            <Dialog
                open={openModal}
                aria-labelledby='form-dialog-title'
                disableEscapeKeyDown
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleClose()
                    }
                }}
            >
                <DialogTitle id='form-dialog-title'>{title}</DialogTitle>

                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>
                        {text}
                        {listErrors && listErrors.status && (
                            <Alert variant='outlined' severity='error' sx={{ mt: 2 }}>
                                Por favor, verifique os campos abaixo:
                                <Typography variant='subtitle1' color='error' sx={{ mt: 2 }}>
                                    {listErrors.errors.map((error, index) => (
                                        <Typography variant='body2' color='error' key={index}>
                                            - {error}
                                        </Typography>
                                    ))}
                                </Typography>
                            </Alert>
                        )}

                        {listErrors && !listErrors.status && (
                            <Alert severity='warning' sx={{ mt: 2 }}>
                                Após concluir o formulário, o mesmo não poderá mais ser alterado!
                            </Alert>
                        )}

                        <Result
                            title={user.papelID == 1 ? 'Resultado do Processo' : 'Observação'}
                            name={'status'}
                            value={result}
                            setResult={setResult}
                            papelID={user.papelID}
                            options={[
                                {
                                    value: 70,
                                    color: 'success',
                                    label: 'Aprovado'
                                },
                                {
                                    value: 60,
                                    color: 'warning',
                                    label: 'Aprovado Parcial'
                                },
                                {
                                    value: 50,
                                    color: 'error',
                                    label: 'Reprovado'
                                }
                            ]}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions className='dialog-actions-dense'>
                    {btnCancel && (
                        <Button variant='outlined' color='primary' onClick={handleClose}>
                            Fechar
                        </Button>
                    )}
                    {btnConfirm && (
                        <Button
                            variant='contained'
                            disabled={(listErrors && listErrors.status) || (user.papelID == 1 && !result.status)}
                            color='primary'
                            onClick={() => {
                                handleClose(), conclusionForm(result)
                            }}
                        >
                            Concluir Formulário
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogFormConclusion

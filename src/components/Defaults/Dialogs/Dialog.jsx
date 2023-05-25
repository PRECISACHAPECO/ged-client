import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Icon from 'src/@core/components/icon'
import { Alert, FormControl, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { validationEmail } from '../../../configs/validations'

const DialogForm = ({
    title,
    text,
    handleClose,
    openModal,
    handleSubmit,
    cnpj,
    inputEmail,
    btnCancel,
    btnConfirm,
    btnCancelColor,
    btnConfirmColor
}) => {
    const [email, setEmail] = useState(null)
    const [errorEmail, setErrorEmail] = useState(false)

    console.log('dialog email: ', email)

    return (
        <>
            <Dialog open={openModal} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>{text}</DialogContentText>

                    {/* Input pra preencher email */}
                    {inputEmail && (
                        <>
                            <FormControl sx={{ mt: 2 }} fullWidth>
                                <TextField
                                    defaultValue=''
                                    type='email'
                                    label='E-mail do Fornecedor (opcional)'
                                    placeholder='E-mail do Fornecedor (opcional)'
                                    aria-describedby='validation-schema-nome'
                                    name='email'
                                    // {...register(`email`, {
                                    //     required: true,
                                    //     validate: value => value.includes('@') || 'E-mail inválido'
                                    // })}
                                    error={email?.length > 0 && errorEmail}
                                    // helperText={errorEmail ? 'Insira um e-mail válido' : null}
                                    inputProps={{
                                        onChange: e => {
                                            // setValue('email', e.target.value)
                                            setEmail(e.target.value)
                                            setErrorEmail(validationEmail(e.target.value) ? false : true)
                                        }
                                    }}
                                />
                                {email?.length > 0 && errorEmail && (
                                    <Typography variant='body2' color='error'>
                                        Por favor, insira um e-mail válido!
                                    </Typography>
                                )}
                            </FormControl>
                            <Alert severity='info' sx={{ mt: 2 }}>
                                Se o e-mail for preenchido, o mesmo receberá as instruções de cadastro e preenchimento
                                do formulário no e-mail.
                            </Alert>
                        </>
                    )}
                </DialogContent>
                <DialogActions className='dialog-actions-dense'>
                    {btnCancel && (
                        <Button variant='outlined' color='primary' onClick={handleClose}>
                            Cancelar
                        </Button>
                    )}
                    {btnConfirm && (
                        <Button
                            variant='contained'
                            disabled={inputEmail && email?.length > 0 && errorEmail}
                            color={btnConfirmColor ? btnConfirmColor : 'error'}
                            onClick={
                                inputEmail && cnpj
                                    ? () => {
                                          handleSubmit(cnpj, email)
                                          setEmail(null)
                                          handleClose()
                                      }
                                    : inputEmail && !cnpj
                                    ? () => {
                                          handleSubmit(email)
                                          setEmail(null)
                                          handleClose()
                                      }
                                    : () => {
                                          handleSubmit()
                                          handleClose()
                                      }
                            }
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

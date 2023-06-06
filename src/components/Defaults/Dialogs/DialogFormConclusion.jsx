import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
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
import { useState } from 'react'
import { validationEmail } from '../../../configs/validations'

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
    const [status, setStatus] = useState(null)
    const [obsConclusao, setObsConclusao] = useState('')

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

                        <Card sx={{ mt: 2 }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    {/* Resultado */}
                                    <Grid item xs={12} md={12}>
                                        <FormControl fullWidth>
                                            <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                                                Resultado do Processo
                                            </Typography>

                                            <Box display='flex' gap={8}>
                                                <RadioGroup
                                                    row
                                                    aria-label='colored'
                                                    name='colored'
                                                    value={status}
                                                    onChange={(e, value) => {
                                                        setStatus(value)
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        value={70}
                                                        name={`status`}
                                                        control={<Radio color='success' />}
                                                        label='Aprovado'
                                                    />
                                                    <FormControlLabel
                                                        value={60}
                                                        name={`status`}
                                                        label='Aprovado parcial'
                                                        control={<Radio color='warning' />}
                                                    />
                                                    <FormControlLabel
                                                        value={50}
                                                        name={`status`}
                                                        label='Reprovado'
                                                        control={<Radio color='error' />}
                                                    />
                                                </RadioGroup>
                                            </Box>
                                        </FormControl>
                                    </Grid>

                                    {/* Gerar não conformidade */}
                                    {status && (status == 50 || status == 60) && (
                                        <Grid item xs={12} md={12}>
                                            <FormControlLabel
                                                label='Gerar não conformidade'
                                                control={
                                                    <Checkbox
                                                        checked={status == 50 ? true : false}
                                                        name='basic-checked'
                                                    />
                                                }
                                            />
                                        </Grid>
                                    )}

                                    {/* Obs de conclusão */}
                                    <Grid item xs={12} md={12} sx={{ mt: 2 }}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label='Observação de conclusão (opcional)'
                                                placeholder='Observação de conclusão (opcional)'
                                                defaultValue={obsConclusao}
                                                multiline
                                                rows={4}
                                                onChange={(e, value) => {
                                                    setObsConclusao(e.target.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
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
                            disabled={(listErrors && listErrors.status) || !status}
                            color='primary'
                            onClick={() => {
                                handleClose(),
                                    conclusionForm({
                                        status,
                                        obsConclusao
                                    })
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

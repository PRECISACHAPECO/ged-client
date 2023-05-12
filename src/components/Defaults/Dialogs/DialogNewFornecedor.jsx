import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    TextField,
    DialogContentText,
    Grid,
    Alert
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { useEffect, useState, useContext } from 'react'
import Icon from 'src/@core/components/icon'
import { AuthContext } from 'src/context/AuthContext'

//* CNPJ Mask
import { cnpjMask } from '../../../configs/masks'
import { validationCNPJ } from '../../../configs/validations'
import { useForm } from 'react-hook-form'
import { api } from 'src/configs/api'
import { toast } from 'react-hot-toast'

const DialogNewFornecedor = ({ handleClose, openModal, unidades, setSelectedUnit }) => {
    const [loading, setLoading] = useState(false)
    const { loggedUnity } = useContext(AuthContext)
    const [data, setData] = useState(null)
    const [cnpj, setCnpj] = useState(null)

    console.log('unidade logada: ' + loggedUnity.nomeFantasia)

    const {
        handleSubmit,
        formState: { errors },
        setValue,
        register
    } = useForm({})

    console.log('🚀 ~ errors:', errors)

    const getFornecedorByCnpj = async cnpj => {
        if (cnpj && cnpj.length === 18 && validationCNPJ(cnpj)) {
            setLoading(true)
            await api
                .post(`/formularios/fornecedor/cnpj`, { unidadeID: loggedUnity.unidadeID, cnpj: cnpj })
                .then(response => {
                    console.log('🚀 ~ response:', response.data)
                    setData(response.data)
                    setCnpj(cnpj)
                    setLoading(false)
                })
        } else {
            setCnpj(null)
        }
    }

    const formFilter = async () => {}
    const sendMail = async () => {}
    const fornecedorStatus = async () => {}
    const makeFornecedor = async () => {
        setLoading(true)
        await api
            .post(`/formularios/fornecedor/makeFornecedor`, { unidadeID: loggedUnity.unidadeID, cnpj: cnpj })
            .then(response => {
                console.log('🚀 ~ makeFornecedor response:', response.data)
                // verificar retorno com status 200
                if (response.status === 200) {
                    setData(response.data)
                    toast.success('Fornecedor habilitado com sucesso')
                    setValue('cnpj', '')
                } else {
                    toast.error('Erro ao tornar fornecedor')
                }

                setLoading(false)
            })
    }

    const onSubmit = values => {
        console.log('🚀 ~ onSubmit ~ values:', values)
    }

    return (
        <>
            <Dialog open={openModal} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Habilitar novo fornecedor</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>
                        Insira o CNPJ da empresa que deseja habilitar como um novo fornecedor. Com isso, a empresa
                        ficará apta a preencher formulários para a {loggedUnity.nomeFantasia}.
                    </DialogContentText>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl fullWidth>
                            <TextField
                                defaultValue=''
                                label='CNPJ'
                                placeholder='CNPJ'
                                aria-describedby='validation-schema-nome'
                                name='cnpj'
                                {...register(`cnpj`, {
                                    required: true,
                                    validate: value => validationCNPJ(value) || 'CNPJ inválido'
                                })}
                                error={errors?.cnpj}
                                helperText={errors.cnpj?.message}
                                inputProps={{
                                    maxLength: 18,
                                    onChange: e => {
                                        setData(null)
                                        setValue('cnpj', cnpjMask(e.target.value)), getFornecedorByCnpj(e.target.value)
                                    }
                                }}
                            />
                        </FormControl>
                    </form>
                    {/* Resultado */}
                    {data && (
                        <Grid container sx={{ mt: 2 }}>
                            <Grid item xs={12} md={12}>
                                {data.isFornecedor && data.hasFormulario ? (
                                    <Alert severity='info'>
                                        Esse CNPJ já possui formulários preenchidos pra {loggedUnity.nomeFantasia}
                                    </Alert>
                                ) : data.isFornecedor && !data.hasFormulario ? (
                                    <Alert severity='success'>
                                        Esse CNPJ já é seu fornecedor, mas ainda não preencheu nenhum formulário
                                    </Alert>
                                ) : !data.isFornecedor && data.hasFormulario ? (
                                    <Alert severity='warning'>
                                        Esse CNPJ não está mais ativo como um fornecedor mas possui formulários
                                        preenchidos
                                    </Alert>
                                ) : !data.isFornecedor && !data.hasFormulario ? (
                                    <Alert severity='info'>Esse CNPJ ainda não é seu fornecedor</Alert>
                                ) : null}
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>

                <DialogActions className='dialog-actions-dense' sx={{ mx: 2, mb: 2 }}>
                    <Button variant='outlined' onClick={handleClose}>
                        Cancelar
                    </Button>

                    {data && (
                        <Button
                            variant='contained'
                            onClick={
                                data.isFornecedor && data.hasFormulario
                                    ? formFilter
                                    : data.isFornecedor && !data.hasFormulario
                                    ? sendMail
                                    : !data.isFornecedor && data.hasFormulario
                                    ? fornecedorStatus
                                    : !data.isFornecedor && !data.hasFormulario
                                    ? makeFornecedor
                                    : null
                            }
                        >
                            {data.isFornecedor && data.hasFormulario
                                ? 'Filtrar formulários'
                                : data.isFornecedor && !data.hasFormulario
                                ? 'Enviar e-mail'
                                : !data.isFornecedor && data.hasFormulario
                                ? 'Reativar fornecedor'
                                : !data.isFornecedor && !data.hasFormulario
                                ? 'Tornar meu fornecedor'
                                : null}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogNewFornecedor

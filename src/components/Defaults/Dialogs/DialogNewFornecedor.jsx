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
import { ParametersContext } from 'src/context/ParametersContext'

//* CNPJ Mask
import { cnpjMask } from '../../../configs/masks'
import { validationCNPJ, validationEmail } from '../../../configs/validations'
import { useForm } from 'react-hook-form'
import { api } from 'src/configs/api'
import { toast } from 'react-hot-toast'
import DialogForm from 'src/components/Defaults/Dialogs/Dialog'

const DialogNewFornecedor = ({ handleClose, openModal, unidades, setSelectedUnit }) => {
    const [loading, setLoading] = useState(false)
    const { user, loggedUnity } = useContext(AuthContext)
    const { handleSearch } = useContext(ParametersContext)
    const [data, setData] = useState(null)
    const [cnpj, setCnpj] = useState(null)
    const [viewEmail, setViewEmail] = useState(false)
    const [email, setEmail] = useState(null)
    const [errorEmail, setErrorEmail] = useState(false)
    const [openConfirmMakeFornecedor, setOpenConfirmMakeFornecedor] = useState(false)

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

    //? Fornecedor já está vinculado e já possui formulários respondidos, então pega o cnpj e coloca na busca do datatable
    const formFilter = async () => {
        console.log('filtra no contexto...')
        handleSearch(cnpj)
        handleClose()
    }

    const fornecedorStatus = async () => {
        setLoading(true)
        await api
            .post(`/formularios/fornecedor/fornecedorStatus`, {
                unidadeID: loggedUnity.unidadeID,
                cnpj: cnpj,
                status: 1
            })
            .then(response => {
                if (response.status === 200) {
                    setData(response.data)
                    toast.success('Fornecedor reativado com sucesso')
                } else {
                    toast.error('Erro ao reativar fornecedor')
                }
                setLoading(false)
            })
    }

    const confirmMakeFornecedor = () => {
        setOpenConfirmMakeFornecedor(true)
    }

    const makeFornecedor = async () => {
        setLoading(true)
        await api
            .post(`/formularios/fornecedor/makeFornecedor`, {
                usuarioID: user.usuarioID,
                unidadeID: loggedUnity.unidadeID,
                papelID: user.papelID,
                cnpj: cnpj
            })
            .then(response => {
                if (response.status === 200) {
                    setData(response.data)
                    toast.success('Fornecedor habilitado com sucesso')
                } else {
                    toast.error('Erro ao tornar fornecedor')
                }
                setLoading(false)
                setOpenConfirmMakeFornecedor(false) // Fecha modal de confirmação
            })
    }

    // Abre o formulário para enviar e-mail para o fornecedor
    function sendMail() {
        setViewEmail(true)

        if (viewEmail && validationEmail(email)) {
            const data = {
                unidadeID: loggedUnity.unidadeID,
                cnpj: cnpj,
                destinatario: email
            }
            api.post('/formularios/fornecedor/sendMail', { data })
                .then(response => {
                    toast.success('E-mail enviado com sucesso')
                    handleClose()
                })
                .catch(error => {
                    console.error('Erro ao enviar email', error)
                })
        }
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
                        <Grid container>
                            <Grid item xs={12} md={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        defaultValue={data?.cnpj ? data.cnpj : ''}
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
                                                setValue('cnpj', cnpjMask(e.target.value)),
                                                    getFornecedorByCnpj(e.target.value),
                                                    setViewEmail(false)
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            {/* Enviar e-mail para o fornecedor novo */}
                            {data && data.isFornecedor && !data.hasFormulario && viewEmail && (
                                <>
                                    <Grid item xs={12} md={12} sx={{ mt: 4 }}>
                                        <FormControl fullWidth>
                                            <TextField
                                                defaultValue=''
                                                type='email'
                                                label='E-mail'
                                                placeholder='E-mail'
                                                aria-describedby='validation-schema-nome'
                                                name='email'
                                                {...register(`email`, {
                                                    required: true,
                                                    validate: value => value.includes('@') || 'E-mail inválido'
                                                })}
                                                error={errorEmail}
                                                helperText={errorEmail ? 'Insira um e-mail válido' : null}
                                                inputProps={{
                                                    onChange: e => {
                                                        setValue('email', e.target.value)
                                                        setEmail(e.target.value)
                                                        setErrorEmail(validationEmail(e.target.value) ? false : true)
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12} sx={{ mt: 2 }}>
                                        <Alert severity='info'>
                                            Um e-mail será enviado para o fornecedor com as instruções de cadastro e
                                            preenchimento do formulário
                                        </Alert>
                                    </Grid>
                                </>
                            )}
                        </Grid>
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
                                    ? confirmMakeFornecedor
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

            {/* Dialog pra confirmar a ação de tornar meu fornecedor */}
            <DialogForm
                title='Confirmar novo fornecedor'
                text={`Tem certeza que deseja tornar o CNPJ ${cnpj} um fornecedor ativo na ${loggedUnity.nomeFantasia} ? Se sim, o mesmo poderá preencher formulários de Fornecedor para a sua empresa.`}
                handleClose={() => setOpenConfirmMakeFornecedor(false)}
                openModal={openConfirmMakeFornecedor}
                handleSubmit={() => makeFornecedor()}
                btnCancel
                btnConfirm
                btnConfirmColor='primary'
            />
        </>
    )
}

export default DialogNewFornecedor

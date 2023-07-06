import Router from 'next/router'
import { useEffect, useState, useRef, useContext } from 'react'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import { api } from 'src/configs/api'
import {
    Card,
    CardContent,
    Grid,
    FormControl,
    TextField,
    FormControlLabel,
    Checkbox,
    Typography,
    CardHeader,
    Button,
    Box,
    Tooltip,
    IconButton,
    Autocomplete
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import DialogForm from 'src/components/Defaults/Dialogs/Dialog'
import { formType } from 'src/configs/defaultConfigs'
import FormHeader from '../../Defaults/FormHeader'
import { backRoute } from 'src/configs/defaultConfigs'
import { toastMessage } from 'src/configs/defaultConfigs'

const FormGrupoAnexos = () => {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(null)
    const [removedItems, setRemovedItems] = useState([])
    const { id } = Router.query
    const router = Router
    const type = formType(router.pathname) // Verifica se é novo ou edição
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const inputRef = useRef(null)
    const { title } = useContext(ParametersContext)
    const { loggedUnity } = useContext(AuthContext)
    console.log('🚀 ~ loggedUnity:', loggedUnity)

    const {
        trigger,
        handleSubmit,
        setValue,
        formState: { errors },
        register
    } = useForm({})

    console.log(errors)

    //! Função que atualiza os dados ou cria novo dependendo do tipo da rota
    const onSubmit = async data => {
        const newData = {
            ...data,
            removedItems,
            unidade: loggedUnity.unidadeID
        }
        console.log('🚀 ~ newData vai para o back:', newData)

        // try {
        //     if (type === 'new') {
        //         await api.post(`${staticUrl}/novo/insertData`, { newData })
        //         router.push(staticUrl)
        //         toast.success(toastMessage.successNew)
        //     } else if (type === 'edit') {
        //         await api.post(`${staticUrl}/${id}`, { newData })
        //         toast.success(toastMessage.successUpdate)
        //     }
        // } catch (error) {
        //     if (error.response && error.response.status === 409) {
        //         toast.error(toastMessage.errorRepeated)
        //     } else {
        //         console.log(error)
        //     }
        // }
    }
    //! Função que deleta os dados
    const handleClickDelete = async () => {
        try {
            await api.delete(`${staticUrl}/${id}`)
            router.push(staticUrl)
            toast.success(toastMessage.successDelete)
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error(toastMessage.pendingDelete)
                setOpen(false)
            } else {
                console.log(error)
            }
        }
    }

    //! Seta os valores iniciais dos campos
    const initializeValues = values => {
        setValue(`status`, values.status == 1 ? true : false)
        setValue(`nome`, values.nome)
        setValue(`descricao`, values.descricao)
        values.requisitos.map((item, index) => {
            setValue(`requisitos[${index}].nome`, item.nome)
            setValue(`requisitos[${index}].descricao`, item.descricao)
            setValue(`requisitos[${index}].statusRequisito`, item.status == 1 ? true : false)
            setValue(`requisitos[${index}].obrigatorio`, item.obrigatorio == 1 ? true : false)
        })
    }

    //! Requisição ao banco de dados, para dados já existentes
    const getData = async () => {
        api.get(`${staticUrl}/getData/${id}`).then(response => {
            initializeValues(response.data)
            setData(response.data)
        })
    }

    //! Requisição ao banco de dados, quando inicializa pagina novo
    const getNovo = async () => {
        api.get(`${staticUrl}/novo/getDataNew`).then(response => {
            console.log('requisição novo', response.data)
            const dataOld = {
                ...response.data,
                requisitos: [
                    {
                        nome: '',
                        grupoanexoitemID: null,
                        descricao: '',
                        status: true,
                        obrigatorio: true
                    }
                ]
            }
            setData(dataOld)
            initializeValues(dataOld)
        })
    }

    //! Função que traz os dados quando carrega a página e atualiza quando as dependências mudam
    useEffect(() => {
        if (type === 'new') {
            getNovo()
        } else if (type === 'edit') {
            getData()
        }
    }, [])

    //! Adiciona um novo item
    const addRequisito = () => {
        const newRequisito = { ...data }
        newRequisito.requisitos.push({
            nome: '',
            grupoanexoitemID: null,
            descricao: '',
            status: true,
            obrigatorio: true
        })
        setData(newRequisito)
    }

    //! Remove item do setValue
    const removeItem = (value, index) => {
        if (data.requisitos.length === 1) {
            toast.error('É necessário ter pelo menos um item!')
            return
        }

        const newRequisitos = [...data.requisitos]
        newRequisitos.splice(index, 1)
        console.log('🚀 ~ data.requisitos:', data.requisitos)
        // newRequisitos.filter(requisito => requisito)
        console.log('🚀 ~ newRequisitos:', newRequisitos)

        setData({
            ...data,
            requisitos: newRequisitos
        })

        setValue('requisitos', newRequisitos)
    }

    console.log('dataaa', data)

    return (
        <>
            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormHeader
                        btnCancel
                        btnSave
                        // disabled={Object.keys(errors).length > 0 ? true : false}
                        handleSubmit={() => handleSubmit(onSubmit)}
                        btnDelete={type === 'edit' ? true : false}
                        onclickDelete={() => setOpen(true)}
                    />
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={11}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Nome'
                                        placeholder='Nome'
                                        name='nome'
                                        {...register('nome', { required: true })}
                                        // defaultValue={data?.nome ?? ''}
                                        error={Boolean(errors.nome)}
                                        aria-describedby='validation-schema-nome'
                                        inputRef={inputRef}
                                    />
                                </FormControl>
                            </Grid>

                            {data && (
                                <Grid item xs={12} md={1}>
                                    <>
                                        <Typography>Ativo</Typography>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    sx={{ ml: 4 }}
                                                    name='status'
                                                    {...register('status')}
                                                    defaultChecked={
                                                        data?.status == 1 ? true : false | (type == 'new' && true)
                                                    }
                                                />
                                            }
                                        />
                                    </>
                                </Grid>
                            )}
                            {data && (
                                /* Formularios */
                                <Grid item xs={12} md={12}>
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            multiple
                                            limitTags={2}
                                            options={data.formulariosOptions}
                                            getOptionLabel={option => option.nome || ''}
                                            defaultValue={data?.formulario ?? []}
                                            name={`formulario[]`}
                                            {...register(`formulario`, {
                                                required: false
                                            })}
                                            onChange={(index, value) => {
                                                const newDataFormularios = value
                                                    ? value.map(item => {
                                                          return {
                                                              id: item?.id,
                                                              nome: item?.nome,
                                                              edit: true
                                                          }
                                                      })
                                                    : []
                                                setValue(`formulario`, newDataFormularios)
                                            }}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label='Formularios'
                                                    placeholder='Formulários'
                                                    error={errors?.formulario}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                            )}
                            <Grid item xs={12} md={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Descrição'
                                        placeholder='Descrição'
                                        name='descricao'
                                        multiline
                                        rows={4}
                                        {...register('descricao')}
                                        defaultValue={data?.descricao ?? ''}
                                        error={Boolean(errors.data?.descricao)}
                                        aria-describedby='validation-schema-descricao'
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                </form>
            </Card>
            <Card sx={{ mt: 4 }}>
                <CardHeader title='Itens do Anexo' />
                <CardContent>
                    <Grid container spacing={3}>
                        {data?.requisitos?.map((item, index) => (
                            <>
                                <input
                                    type='hidden'
                                    name={`requisitos[${index}].grupoanexoitemID`}
                                    {...register(`requisitos[${index}].grupoanexoitemID`)}
                                    defaultValue={item?.grupoanexoitemID ?? ''}
                                />

                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth>
                                        <TextField
                                            label='Nome'
                                            placeholder='Nome'
                                            // defaultValue={item?.nome ?? ''}
                                            name={`requisitos[${index}].nome`}
                                            {...register(`requisitos[${index}].nome`)}
                                            error={errors?.requisitos?.[index]?.nome ? true : false}
                                            aria-describedby='validation-schema-nome'
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <TextField
                                            label='Descrição'
                                            defaultValue={item?.descricao ?? ''}
                                            placeholder='Descrição'
                                            // multiline
                                            // rows={2}
                                            name={`requisitos[${index}].descricao`}
                                            {...register(`requisitos[${index}].descricao`, { required: true })}
                                            error={errors?.requisitos?.[index]?.descricao ? true : false}
                                            aria-describedby='validation-schema-descricao'
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={1}>
                                    <Typography variant='caption'>{index === 0 ? 'Obrigatório' : ` `}</Typography>

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                sx={{ ml: 4 }}
                                                name={`requisitos[${index}].obrigatorio`}
                                                {...register(`requisitos[${index}].obrigatorio`)}
                                                defaultChecked={item.obrigatorio == 1 ? true : false}
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} md={1}>
                                    {index === 0 && <Typography variant='caption'>Status</Typography>}
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                sx={{ ml: 4 }}
                                                name={`requisitos[${index}].statusRequisito`}
                                                {...register(`requisitos[${index}].statusRequisito`)}
                                                defaultChecked={item.status == 1 ? true : false}
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} md={1}>
                                    <Box flexBasis='20%' textAlign='center'>
                                        {index === 0 && <Typography variant='caption'>Remover</Typography>}
                                        <Tooltip
                                            title={
                                                2 == 1
                                                    ? `Este item não pode mais ser removido pois já foi respondido em um formulário`
                                                    : `Remover este item`
                                            }
                                        >
                                            <IconButton
                                                color='error'
                                                onClick={() => removeItem(item, index)}
                                                sx={{
                                                    opacity: 2 === 1 ? 0.5 : 1,
                                                    cursor: 2 === 1 ? 'default' : 'pointer'
                                                }}
                                            >
                                                <Icon icon='tabler:trash-filled' />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Grid>
                            </>
                        ))}
                    </Grid>
                    <Button
                        variant='outlined'
                        color='primary'
                        sx={{ mt: 4 }}
                        startIcon={<Icon icon='material-symbols:add-circle-outline-rounded' />}
                        onClick={() => {
                            addRequisito()
                        }}
                    >
                        Inserir item
                    </Button>
                </CardContent>
            </Card>

            <DialogForm
                text='Tem certeza que deseja excluir?'
                title={'Excluir ' + title}
                openModal={open}
                handleClose={() => setOpen(false)}
                handleSubmit={handleClickDelete}
                btnCancel
                btnConfirm
            />
        </>
    )
}

export default FormGrupoAnexos

import Router from 'next/router'
import { useEffect, useState, useRef, useContext } from 'react'
import { ParametersContext } from 'src/context/ParametersContext'
import { api } from 'src/configs/api'
import {
    Card,
    CardContent,
    Grid,
    FormControl,
    TextField,
    FormControlLabel,
    Autocomplete,
    Checkbox,
    Typography,
    CardHeader,
    Button,
    Box,
    Tooltip,
    IconButton
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Switch from '@mui/material/Switch'
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

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
        register
    } = useForm({})

    console.log(errors)

    // Função que atualiza os dados ou cria novo dependendo do tipo da rota
    const onSubmit = async data => {
        const newData = {
            ...data,
            removed: removedItems
        }

        try {
            if (type === 'new') {
                await api.post(`${staticUrl}/novo`, newData)
                router.push(staticUrl)
                toast.success(toastMessage.successNew)
            } else if (type === 'edit') {
                await api.post(`${staticUrl}/${id}`, { newData })
                console.log('data', newData)
                toast.success(toastMessage.successUpdate)
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error(toastMessage.errorRepeated)
            } else {
                console.log(error)
            }
        }
    }
    // Função que deleta os dados
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

    const initializeValues = values => {
        setValue(`nome`, values.nome)
        setValue(`descricao`, values.descricao)
        setValue(`formulario`, values.formulario)
        setValue(`status`, values.status == 1 ? true : false)
        values.requisitos.map((item, index) => {
            setValue(`requisitos[${index}].nome`, item.nome)
            setValue(`requisitos[${index}].descricao`, item.descricao)
            setValue(`requisitos[${index}].statusRequisito`, item.status == 1 ? true : false)
            setValue(`requisitos[${index}].obrigatorio`, item.obrigatorio == 1 ? true : false)
        })
    }

    const getData = async () => {
        api.get(`${staticUrl}/${id}`, {
            headers: { 'function-name': 'getData' }
        }).then(response => {
            setData(response.data)
            initializeValues(response.data)
        })
    }

    const getNovo = async () => {
        api.get(`${staticUrl}/novo`, {
            headers: { 'function-name': 'getNovo' }
        }).then(response => {
            setData(response.data)
        })
    }

    console.log('data', data)
    // Função que traz os dados quando carrega a página e atualiza quando as dependências mudam
    useEffect(() => {
        if (type === 'new') {
            setTimeout(() => {
                inputRef.current.focus()
            }, 100)
            getNovo()
        } else if (type === 'edit') {
            getData()
        }
    }, [])

    const addRequisito = () => {
        const newRequisito = { ...data }
        newRequisito.requisitos.push({
            nome: '',
            grupoanexoitemID: null,
            descricao: '',
            statusRequisito: true,
            obrigatorio: true
        })
        setData(newRequisito)
    }

    const removeItem = value => {
        // Array items removidos pra enviar pro backend
        const newRemovedItem = [...removedItems]
        newRemovedItem.push(value.grupoanexoitemID)
        setRemovedItems(newRemovedItem)

        // remover item do array que monta os itens na tela
        data.requisitos.splice(value, 1)

        console.log('🚀 ~ newRemovedItem:', newRemovedItem)
    }

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
                            <Grid item xs={12} md={8}>
                                <FormControl fullWidth>
                                    {data && (
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
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    {data && (
                                        <Autocomplete
                                            options={data?.formulario.options}
                                            getOptionSelected={(option, value) => option.id === value.id}
                                            defaultValue={data?.formulario?.id ? data?.formulario : null}
                                            getOptionLabel={option => option.nome}
                                            name='formulario'
                                            {...register('formulario')}
                                            onChange={(event, newValue) => {
                                                console.log('🚀 ~ newValue:', { newValue })
                                                setValue(`formulario`, newValue ? newValue : null)
                                            }}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label='Formulário'
                                                    placeholder='Formulário'
                                                    error={errors?.formulario ? true : false}
                                                />
                                            )}
                                        />
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={1}>
                                {data && (
                                    <>
                                        <Typography>Ativo</Typography>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    sx={{ ml: 4 }}
                                                    defaultChecked={
                                                        type === 'new' ? true : data?.status == 1 ? true : false
                                                    }
                                                    name='status'
                                                    {...register('status')}
                                                />
                                            }
                                        />
                                    </>
                                )}
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <FormControl fullWidth>
                                    {data && (
                                        <TextField
                                            label='Descrição'
                                            placeholder='Descrição'
                                            name='descricao'
                                            multiline
                                            rows={4}
                                            {...register('descricao', { required: true })}
                                            defaultValue={data?.descricao ?? ''}
                                            error={Boolean(errors.descricao)}
                                            aria-describedby='validation-schema-descricao'
                                        />
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                </form>
            </Card>
            <Card sx={{ mt: 4 }}>
                <CardHeader title='Requisitos de Anexo' />
                <CardContent>
                    <Grid container spacing={3}>
                        {data &&
                            data.requisitos.map((item, index) => (
                                <>
                                    <input
                                        type='hidden'
                                        defaultValue={item?.grupoanexoitemID ?? ''}
                                        name={`requisitos[${index}].grupoanexoitemID`}
                                        {...register(`requisitos[${index}].grupoanexoitemID`)}
                                    />

                                    <Grid item xs={12} md={3}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label='Nome'
                                                placeholder='Nome'
                                                // defaultValue={item?.nome ?? ''}
                                                name={`requisitos[${index}].nome`}
                                                {...register(`requisitos[${index}].nome`, { required: true })}
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
                                        <Typography>{index === 0 ? 'Obrigatório' : ` `}</Typography>

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
                                        {index === 0 && <Typography>Status</Typography>}
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
                                            {index === 0 && <Typography>Remover</Typography>}
                                            <Tooltip
                                                title={
                                                    2 == 1
                                                        ? `Este item não pode mais ser removido pois já foi respondido em um formulário`
                                                        : `Remover este item`
                                                }
                                            >
                                                <IconButton
                                                    color='error'
                                                    onClick={() => removeItem(item)}
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
                        Inserir requisito
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

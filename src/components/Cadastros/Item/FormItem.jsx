import Router from 'next/router'
<<<<<<< HEAD
import { useEffect, useState, useContext } from 'react'
import { ParametersContext } from 'src/context/ParametersContext'
import { RouteContext } from 'src/context/RouteContext'
=======
import { useEffect, useState, useRef } from 'react'
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
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
    Typography
} from '@mui/material'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Switch from '@mui/material/Switch'
import toast from 'react-hot-toast'
import Loading from 'src/components/Loading'
import DialogForm from 'src/components/Defaults/Dialogs/Dialog'
import { formType } from 'src/configs/defaultConfigs'
import FormHeader from '../../Defaults/FormHeader'
import { backRoute } from 'src/configs/defaultConfigs'
import { toastMessage } from 'src/configs/defaultConfigs'

const FormItem = ({ id }) => {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(null)
<<<<<<< HEAD
<<<<<<< HEAD

    //! Se perder Id, copia do localstorage
    const { title, setStorageId, getStorageId } = useContext(ParametersContext)
=======
    const [fornecedorID, setFornecedorID] = useState(null)
    const { id } = Router.query
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
    const router = Router
    let id = router.query.id
    // if (!id) id = getStorageId()
    // useEffect(() => {
    //     setStorageId(id)
    // }, [])

    const type = formType(router.pathname) // Verifica se é novo ou edição
    const staticUrl = backRoute(router.pathname) // Url sem ID
<<<<<<< HEAD
=======
    const router = Router
    const type = id && id > 0 ? 'edit' : 'new'
    const staticUrl = router.pathname
    const { title } = useContext(ParametersContext)
    const { setId } = useContext(RouteContext)
=======
    const inputRef = useRef(null)

    const schema = yup.object().shape({
        nome: yup.string().required('Campo obrigatório')
    })
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b

>>>>>>> 775e144a93fcabce34b30f3c016004f6865b09b2
    const {
        control,
        handleSubmit,
<<<<<<< HEAD
        setValue,
        reset,
        control,
=======
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
        formState: { errors },
        register
    } = useForm({
        // defaultValues: {},
        // mode: 'onChange',
        resolver: yupResolver(schema)
    })

    // Função que atualiza os dados ou cria novo dependendo do tipo da rota
    const onSubmit = async data => {
        const newData = { ...data, tipoFormularioID: fornecedorID }
        try {
            if (type === 'new') {
<<<<<<< HEAD
                await api.post(`${backRoute(staticUrl)}/new/insertData`, values).then(response => {
                    router.push(`${backRoute(staticUrl)}`) //? backRoute pra remover 'novo' da rota
                    setId(response.data)
                    toast.success(toastMessage.successNew)
                })
=======
                await api.post(`${staticUrl}/novo`, newData)
                router.push(staticUrl)
                toast.success(toastMessage.successNew)
                console.log(newData)
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
            } else if (type === 'edit') {
                await api.put(`${staticUrl}/${id}`, newData)
                toast.success(toastMessage.successUpdate)
                console.log('editado')
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
            setId(null)
            setOpen(false)
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

    const getData = async () => {
<<<<<<< HEAD
        try {
<<<<<<< HEAD
            console.log('🚀 ~ id:', id)
            const route = type === 'new' ? `${staticUrl}/new/getData` : `${staticUrl}/${id}`
            await api.get(route).then(response => {
=======
            const route = type === 'new' ? `${backRoute(staticUrl)}/new/getData` : `${staticUrl}/getData/${id}`
            await api.post(route).then(response => {
>>>>>>> 775e144a93fcabce34b30f3c016004f6865b09b2
                setData(response.data)
                reset(response.data) //* Insere os dados no formulário

                console.log('🚀 ~ getData:', response.data)
            })
        } catch (error) {
            console.log(error)
        }
=======
        api.get(`${staticUrl}/${id}`, {
            headers: { 'function-name': 'getData' }
        }).then(response => {
            setData(response.data)
        })
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
    }

    const getNovo = async () => {
        api.get(`${staticUrl}/novo`, {
            headers: { 'function-name': 'getNovo' }
        }).then(response => {
            setData(response.data)
        })
    }
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
    }, [id])

    return (
        <>
<<<<<<< HEAD
            {!data && <Loading />}
            {data && (
                <Card>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormHeader
                            btnCancel
                            btnSave
                            handleSubmit={() => handleSubmit(onSubmit)}
                            btnDelete={type === 'edit' ? true : false}
                            onclickDelete={() => setOpen(true)}
                            type={type}
                        />
                        <CardContent>
                            <Grid container spacing={5}>
                                <Input
                                    xs={12}
                                    md={11}
                                    title='Nome'
                                    name='fields.nome'
                                    required={true}
                                    register={register}
                                    errors={errors?.fields?.nome}
                                />
                                <Check
                                    xs={12}
                                    md={1}
                                    title='Ativo'
                                    name='fields.status'
                                    value={data.fields.status}
                                    typePage={type}
                                    register={register}
                                />
                                <Select
                                    xs={12}
                                    md={12}
                                    title='Formulários'
                                    name='formulario.fields'
                                    value={data?.formulario.fields}
                                    required={true}
                                    options={data.formulario.options}
                                    register={register}
                                    control={control}
                                    setValue={setValue}
                                    errors={errors?.formulario?.fields}
                                />
=======
            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormHeader
                        btnCancel
                        btnSave
                        disabled={Object.keys(errors).length > 0 ? true : false}
                        handleSubmit={() => handleSubmit(onSubmit)}
                        btnDelete={type === 'edit' ? true : false}
                        onclickDelete={() => setOpen(true)}
                    />
                    <CardContent>
                        <Grid container spacing={5}>
                            <Grid item xs={12} md={8}>
                                <FormControl fullWidth>
                                    {data && (
                                        <TextField
                                            label='Nome'
                                            placeholder='Nome'
                                            name='nome'
                                            {...register('nome')}
                                            defaultValue={data?.value?.nome ?? ''}
                                            error={Boolean(errors.nome)}
                                            aria-describedby='validation-schema-nome'
                                            inputRef={inputRef}
                                        />
                                    )}
                                </FormControl>
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
                            </Grid>

                            {/* Auto complete que traga o campo data.tipoFornecedor.nome preenchido, mas que traga os dados do campo data.formularios para poder escolher outro */}
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    {data && (
                                        <Autocomplete
                                            options={data?.formularios ?? []}
                                            filterOptions={(options, state) =>
                                                options.filter(option =>
                                                    option.nome.toLowerCase().includes(state.inputValue.toLowerCase())
                                                )
                                            }
                                            getOptionLabel={option => option.nome}
                                            onChange={(event, newValue) => {
                                                setFornecedorID(newValue?.parFormularioID)
                                            }}
                                            defaultValue={data?.tipoFormulario ?? null}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label='Formulário'
                                                    placeholder='Formulário'
                                                    name='formulario'
                                                    {...register('formulario', { required: true })}
                                                    defaultValue={data?.tipoFormulario ?? null}
                                                    error={Boolean(errors.formulario)}
                                                    aria-describedby='formulario-error'
                                                />
                                            )}
                                        />
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={1}>
                                {data && (
                                    <>
                                        <Typography>Status</Typography>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    sx={{ ml: 4 }}
                                                    defaultChecked={
                                                        type === 'new' ? true : data?.value?.status == 1 ? true : false
                                                    }
                                                    name='status'
                                                    {...register('status')}
                                                />
                                            }
                                        />
                                    </>
                                )}
                            </Grid>
                        </Grid>
                    </CardContent>
                </form>
            </Card>

            <DialogForm
                text='Tem certeza que deseja excluir?'
                title='Excluir dado'
                openModal={open}
                handleClose={() => setOpen(false)}
                handleSubmit={handleClickDelete}
                btnCancel
                btnConfirm
            />
        </>
    )
}

export default FormItem

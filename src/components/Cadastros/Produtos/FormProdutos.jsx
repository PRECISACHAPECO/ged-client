import Router from 'next/router'
import { useEffect, useState, useRef, useContext } from 'react'
import { api } from 'src/configs/api'
import { Card, CardContent, Grid, FormControl, TextField, FormControlLabel, Checkbox } from '@mui/material'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Switch from '@mui/material/Switch'
import toast from 'react-hot-toast'
import DialogForm from 'src/components/Defaults/Dialogs/Dialog'
import { AuthContext } from 'src/context/AuthContext'
import { formType } from 'src/configs/defaultConfigs'
import FormHeader from '../../Defaults/FormHeader'
import { backRoute } from 'src/configs/defaultConfigs'
import { toastMessage } from 'src/configs/defaultConfigs'
<<<<<<< HEAD
import Loading from 'src/components/Loading'
import { ParametersContext } from 'src/context/ParametersContext'
import { RouteContext } from 'src/context/RouteContext'
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import Input from 'src/components/Form/Input'
import Check from 'src/components/Form/Check'
=======
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b

const FormProdutos = ({ id }) => {
    const [open, setOpen] = useState(false)
<<<<<<< HEAD
    const [data, setData] = useState(null)
    const { setId } = useContext(RouteContext)
    const router = Router
    const type = id && id > 0 ? 'edit' : 'new'
    const staticUrl = router.pathname
    const { title } = useContext(ParametersContext)
    const { loggedUnity } = useContext(AuthContext)
=======
    const { id } = Router.query
    const router = Router
    const { user, loggedUnity } = useContext(AuthContext)
    const type = formType(router.pathname) // Verifica se é novo ou edição
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const inputRef = useRef(null)

    const schema = yup.object().shape({
        nome: yup.string().required('Campo obrigatório')
    })
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        // defaultValues: {},
        // mode: 'onChange',
        resolver: yupResolver(schema)
    })

    // Função que atualiza os dados ou cria novo dependendo do tipo da rota
    const onSubmit = async data => {
        try {
            if (type === 'new') {
<<<<<<< HEAD
                await api.post(`${backRoute(staticUrl)}/new/insertData`, newValues).then(response => {
                    router.push(`${backRoute(staticUrl)}`) //? backRoute pra remover 'novo' da rota
                    setId(response.data)
                    toast.success(toastMessage.successNew)
                })
=======
                await api.post(`${staticUrl}/novo`, { data: data, unidadeID: loggedUnity.unidadeID })
                router.push(staticUrl)
                toast.success(toastMessage.successNew)
                reset(data)
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
            } else if (type === 'edit') {
                await api.put(`${staticUrl}/${id}`, data)
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

<<<<<<< HEAD
    //? Dados iniciais ao carregar página
    const getData = async () => {
        if (type == 'new') {
            setData({
                fields: {
                    nome: '',
                    status: 1
                }
            })
        }
        try {
            const route = type === 'new' ? `${backRoute(staticUrl)}/new/getData` : `${staticUrl}/getData/${id}`
            await api.post(route, { id }).then(response => {
                setData(response.data)
                console.log('🚀 ~ response.data:', response.data)
                reset(response.data) //* Insere os dados no formulário
            })
        } catch (error) {
            console.log(error)
        }
    }

    //? Função que traz os dados quando carrega a página e atualiza quando as dependências mudam
=======
    // Função que traz os dados quando carrega a página e atualiza quando as dependências mudam
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
    useEffect(() => {
        if (type === 'new') {
            inputRef.current.focus()
        } else {
            const getData = async () => {
                try {
                    const response = await api.get(`${staticUrl}/${id}`)
                    reset(response.data)
                } catch (error) {
                    console.log(error)
                }
            }
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
                                    md={8}
                                    title='Nome'
                                    name='fields.nome'
                                    required={true}
                                    register={register}
                                    errors={errors?.fields?.nome}
                                />
                                <Input
                                    xs={12}
                                    md={3}
                                    title='Unidade de Medida'
                                    name='fields.unidadeMedida'
                                    required={true}
                                    register={register}
                                    errors={errors?.fields?.unidadeMedida}
                                />
                                <Check
                                    xs={12}
                                    md={1}
                                    title='Ativo'
                                    name='fields.status'
                                    value={data?.fields.status}
                                    typePage={type}
                                    register={register}
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
                            <Grid item xs={12} md={9}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='nome'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='Nome'
                                                onChange={onChange}
                                                placeholder='Nome'
                                                error={Boolean(errors.nome)}
                                                aria-describedby='validation-schema-nome'
                                                inputRef={inputRef}
                                                rules={{ required: true }}
                                            />
                                        )}
                                    />
                                </FormControl>
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
                            </Grid>

                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='unidadeMedida'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='Unidade de Medida'
                                                onChange={onChange}
                                                placeholder='Unidade de Medida'
                                                error={Boolean(errors.unidadeMedida)}
                                                aria-describedby='validation-schema-unidadeMedida'
                                                rules={{ required: true }}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={1}>
                                <FormControl>
                                    <Controller
                                        name='status'
                                        control={control}
                                        rules={{ required: false }}
                                        render={({ field: { value, onChange } }) => (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={type === 'new' ? true : value ?? false}
                                                        onChange={onChange}
                                                    />
                                                }
                                                label='Status'
                                                labelPlacement='top'
                                                sx={{ mr: 8 }}
                                            />
                                        )}
                                    />
                                </FormControl>
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

export default FormProdutos

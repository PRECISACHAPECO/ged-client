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
    Typography
} from '@mui/material'
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

const FormItem = () => {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(null)
    const [fornecedorID, setFornecedorID] = useState(null)
    const { id } = Router.query
    const router = Router
    const type = formType(router.pathname) // Verifica se é novo ou edição
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const inputRef = useRef(null)
    const { title } = useContext(ParametersContext)

    const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
        register
    } = useForm({})

    //! Seta os valores iniciais dos campos
    const initializeValues = values => {
        setValue(`nome`, values?.value?.nome)
        setValue(`formulario`, values?.tipoFormulario?.nome)
        setValue(`status`, values?.value?.status)
    }

    // Função que atualiza os dados ou cria novo dependendo do tipo da rota
    const onSubmit = async data => {
        const newData = { ...data, tipoFormularioID: fornecedorID }
        try {
            if (type === 'new') {
                await api.post(`${staticUrl}/novo`, newData)
                router.push(staticUrl)
                toast.success(toastMessage.successNew)
                console.log(newData)
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

    const getData = async () => {
        api.get(`${staticUrl}/${id}`, {
            headers: { 'function-name': 'getData' }
        }).then(response => {
            initializeValues(response.data)
            setData(response.data)
            console.log('data', response.data)
        })
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
    }, [])

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
                        <Grid container spacing={5}>
                            <Grid item xs={12} md={8}>
                                <FormControl fullWidth>
                                    {data && (
                                        <TextField
                                            label='Nome'
                                            placeholder='Nome'
                                            name='nome'
                                            {...register('nome', { required: true })}
                                            defaultValue={data?.value?.nome ?? ''}
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
                                                <>
                                                    <TextField
                                                        {...params}
                                                        label='Formulário'
                                                        placeholder='Formulário'
                                                        name='formulario'
                                                        {...register('formulario', { required: true })}
                                                        defaultValue={data?.tipoFormulario ?? ''}
                                                        error={Boolean(errors.formulario)}
                                                    />
                                                </>
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

export default FormItem

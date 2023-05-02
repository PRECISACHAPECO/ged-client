import Router from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/configs/api'
import {
    Card,
    CardContent,
    Grid,
    FormControl,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Typography
} from '@mui/material'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormHelperText } from '@mui/material'
import Switch from '@mui/material/Switch'
import toast from 'react-hot-toast'
import DialogForm from 'src/components/Defaults/Dialogs/Dialog'
import { formType } from 'src/configs/defaultConfigs'
import FormHeader from '../../Defaults/FormHeader'
import { backRoute } from 'src/configs/defaultConfigs'
import { toastMessage } from 'src/configs/defaultConfigs'

const FormSistemaQualidade = () => {
    const [open, setOpen] = useState(false)
    const { id } = Router.query
    const router = Router
    const type = formType(router.pathname) // Verifica se é novo ou edição
    const staticUrl = backRoute(router.pathname) // Url sem ID

    const schema = yup.object().shape({
        nome: yup.string().required('Campo obrigatório')
    })

    const {
        control,
        handleSubmit,
        register,
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
                await api.post(`${staticUrl}/novo`, data)
                router.push(staticUrl)
                toast.success(toastMessage.successNew)
                reset(data)
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

    // Função que traz os dados quando carrega a página e atualiza quando as dependências mudam
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await api.get(`${staticUrl}/${id}`)
                reset(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [])

    return (
        <>
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
                            <Grid item xs={12} md={11}>
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
                                            />
                                        )}
                                    />
                                    {errors.nome && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-nome'>
                                            {errors.nome.message}
                                        </FormHelperText>
                                    )}
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

export default FormSistemaQualidade

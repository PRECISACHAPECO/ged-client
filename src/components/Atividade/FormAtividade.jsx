import Router from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/configs/api'
import Link from 'next/link'
import { Card, CardContent, CardHeader, Grid, FormControl, TextField, Button } from '@mui/material'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormHelperText } from '@mui/material'
import Switch from '@mui/material/Switch'
import toast from 'react-hot-toast'
import DialogForm from 'src/components/Dialog'
import { formType } from 'src/configs/defaultConfigs'
import FormHeader from '../FormHeader'

const FormAtividade = () => {
    const [open, setOpen] = useState(false)
    const { id } = Router.query
    const router = Router
    const type = formType(router.pathname) // Verifica se é novo ou edição

    const schema = yup.object().shape({
        nome: yup.string().required('Campo obrigatório')
    })

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
                await api.post(`atividade/novo`, data)
                toast.success('Dados cadastrados com sucesso!')
                data = {
                    ...data,
                    status: 1
                }
                reset(data)
            } else if (type === 'edit') {
                console.log('onSubmit: ', data)
                await api.put(`atividade/${id}`, data)
                toast.success('Dados atualizados com sucesso!')
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error('Atividade já cadastrada!')
            } else {
                console.log(error)
            }
        }
    }

    // Função que deleta os dados
    const handleClickDelete = async () => {
        try {
            await api.delete(`atividade/${id}`)
            router.push('/cadastros/atividade')
            toast.error('Dados deletados com sucesso!')
        } catch (error) {
            console.log(error)
        }
    }

    // Funções para abrir modal
    const handleClickOpen = () => setOpen(true)

    // Funções para fechar modal
    const handleClose = () => setOpen(false)

    // Função que traz os dados quando carrega a página e atualiza quando as dependências mudam
    useEffect(() => {
        const getAtividade = async () => {
            try {
                const response = await api.get(`atividade/${id}`)
                reset(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        getAtividade()
    }, [])

    return (
        <>
            <h2>Atividade</h2>
            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormHeader
                        btnCancel
                        btnSave
                        handleSubmit={() => handleSubmit(onSubmit)}
                        btnDelete={type === 'edit' ? true : false}
                        onclickDelete={handleClickOpen}
                    />
                    <CardContent>
                        <Grid container spacing={5}>
                            <Grid item xs={12}>
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
                                <FormControl fullWidth>
                                    <Controller
                                        name='status'
                                        control={control}
                                        rules={{ required: false }}
                                        render={({ field: { value, onChange } }) => (
                                            <Switch
                                                checked={value == '1' ? true : false}
                                                onChange={onChange}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        )}
                                    />
                                    {errors.status && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-status'>
                                            {errors.status.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <DialogForm
                                    text='Tem certeza que deseja excluir?'
                                    title='Excluir atividade'
                                    openModal={open}
                                    handleClose={handleClose}
                                    handleSubmit={handleClickDelete}
                                    btnCancelar
                                    btnConfirmar
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </form>
            </Card>
        </>
    )
}

export default FormAtividade

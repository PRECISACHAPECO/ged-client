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
import Icon from 'src/@core/components/icon'
import DialogForm from 'src/components/Dialog'

const AtividadeForm = () => {
    const [open, setOpen] = useState(false)
    const { id } = Router.query
    const router = Router

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

    // Função que atualiza os dados
    const onSubmit = async data => {
        try {
            await api.put(`atividade/${id}`, data)
            toast.success('Dados atualizados com sucesso!')
        } catch (error) {
            console.log(error)
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

    const handleClickOpen = () => setOpen(true)

    const handleClose = () => setOpen(false)

    return (
        <div>
            <Card>
                <CardHeader title='Atividades' />
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
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

                                <Button type='submit' variant='contained' color='primary' sx={{ mt: 2, mr: 2 }}>
                                    Salvar
                                </Button>
                                <Link href='/cadastros/atividade'>
                                    <Button type='button' variant='outlined' color='primary' sx={{ mt: 2 }}>
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button
                                    startIcon={<Icon icon='ph:trash-simple' fontSize={20} />}
                                    onClick={handleClickOpen}
                                    type='button'
                                    variant='outlined'
                                    color='error'
                                    sx={{ mt: 2, ml: 2 }}
                                >
                                    Excluir
                                </Button>
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
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AtividadeForm

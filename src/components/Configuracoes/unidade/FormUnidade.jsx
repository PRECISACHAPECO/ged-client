import Router from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { api } from 'src/configs/api'
import { Card, CardContent, Grid, FormControl, TextField, FormControlLabel } from '@mui/material'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormHelperText } from '@mui/material'
import Switch from '@mui/material/Switch'
import toast from 'react-hot-toast'
import DialogForm from 'src/components/Dialog'
import { formType } from 'src/configs/defaultConfigs'
import FormHeader from '../../FormHeader'
import { backRoute } from 'src/configs/defaultConfigs'
import { toastMessage } from 'src/configs/defaultConfigs'
import SwitchBase from '@mui/material/internal/SwitchBase'
// ** CleaveJS Imports
import { format } from 'date-fns'
import Cleave from 'cleave.js'
import 'cleave.js/dist/addons/cleave-phone.br'

const FormUnidade = () => {
    const [open, setOpen] = useState(false)
    const { id } = Router.query
    const router = Router
    const type = formType(router.pathname) // Verifica se é novo ou edição
    const staticUrl = backRoute(router.pathname) // Url sem ID

    const dateFormat = 'dd/MM/yyyy'
    const inputRef = useRef(null)

    const schema = yup.object().shape({
        nomeFantasia: yup.string().required(''),
        razaoSocial: yup.string().nullable(),
        cnpj: yup.string().nullable(),
        responsavel: yup.string().nullable(),
        email: yup.string().nullable(),
        dataCadastro: yup.string().nullable(),
        telefone1: yup.string().nullable(),
        telefone2: yup.string().nullable(),
        cep: yup.string().nullable(),
        logradouro: yup.string().nullable(),
        complemento: yup.string().nullable(),
        numero: yup.string().nullable(),
        bairro: yup.string().nullable(),
        cidade: yup.string().nullable(),
        uf: yup.string().nullable(),
        status: yup.string().nullable()
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
                await api.post(`${staticUrl}/novo`, data)
                router.push(staticUrl)
                toast.success(toastMessage.successNew)
                reset(data)
            } else if (type === 'edit') {
                await api.put(`${staticUrl}/${id}`, data)
                toast.success(toastMessage.successUpdate)
                console.log('editado')
                console.log(data)
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
        if (inputRef.current) {
            new Cleave(inputRef.current, {
                date: true,
                datePattern: ['d', 'm', 'Y']
            })
        }
    }, [])

    return (
        <>
            {JSON.stringify(errors)}
            {/*  Ajustar onde vai ficar */}
            {/* <Grid item xs={12} md={1}>
                <FormControl>
                    <Controller
                        name='status'
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { value, onChange } }) => (
                            <FormControlLabel
                                checked={value == '1' ? true : false}
                                onChange={onChange}
                                inputProps={{ 'aria-label': 'controlled' }}
                                label='Status'
                                labelPlacement='top'
                                sx={{ mr: 8 }}
                                control={<Switch />}
                            />
                        )}
                    />
                    {errors.status && (
                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-status'></FormHelperText>
                    )}
                </FormControl>
            </Grid> */}
            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormHeader
                        btnCancel
                        btnSave
                        handleSubmit={() => handleSubmit(onSubmit)}
                        btnDelete={type === 'edit' ? true : false}
                        onclickDelete={() => setOpen(true)}
                    />
                    <CardContent>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='nomeFantasia'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='Nome Fantasia'
                                                onChange={onChange}
                                                placeholder='Nome Fantasia'
                                                error={Boolean(errors.nomeFantasia)}
                                                aria-describedby='validation-schema-nome'
                                            />
                                        )}
                                    />
                                    {errors.nomeFantasia && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-nome'>
                                            {errors.nomeFantasia.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='razaoSocial'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='Razão Social'
                                                onChange={onChange}
                                                placeholder='Nome'
                                                error={Boolean(errors.razaoSocial)}
                                                aria-describedby='validation-schema-razaoSocial'
                                            />
                                        )}
                                    />
                                    {errors.razaoSocial && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-razaoSocial'>
                                            {errors.razaoSocial.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='cnpj'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='CNPJ'
                                                onChange={onChange}
                                                placeholder='CNPJ'
                                                error={Boolean(errors.cnpj)}
                                                aria-describedby='validation-schema-cnpj'
                                            />
                                        )}
                                    />
                                    {errors.cnpj && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-cnpj'>
                                            {errors.cnpj.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='responsavel'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='Responsável'
                                                onChange={onChange}
                                                placeholder='Responsável'
                                                error={Boolean(errors.responsavel)}
                                                aria-describedby='validation-schema-responsavel'
                                            />
                                        )}
                                    />
                                    {errors.responsavel && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-responsavel'>
                                            {errors.responsavel.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='email'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='Email'
                                                onChange={onChange}
                                                placeholder='Email'
                                                error={Boolean(errors.email)}
                                                aria-describedby='validation-schema-email'
                                            />
                                        )}
                                    />
                                    {errors.email && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-email'>
                                            {errors.email.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='dataCadastro'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                // value={value ? format(new Date(value), dateFormat) : ''}
                                                label='Data de cadastro'
                                                onChange={onChange}
                                                inputRef={inputRef}
                                                placeholder='Data de cadastro'
                                                error={Boolean(errors.dataCadastro)}
                                                aria-describedby='validation-schema-dataCadastro'
                                            />
                                        )}
                                    />
                                    {errors.dataCadastro && (
                                        <FormHelperText
                                            sx={{ color: 'error.main' }}
                                            id='validation-schema-dataCadastro'
                                        >
                                            {errors.dataCadastro.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='telefone1'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='Telefone 1'
                                                onChange={onChange}
                                                placeholder='Telefone 1'
                                                error={Boolean(errors.telefone1)}
                                                aria-describedby='validation-schema-telefone1'
                                            />
                                        )}
                                    />
                                    {errors.telefone1 && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-telefone1'>
                                            {errors.telefone1.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='telefone2'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='Telefone 2'
                                                onChange={onChange}
                                                placeholder='Telefone 2'
                                                error={Boolean(errors.telefone2)}
                                                aria-describedby='validation-schema-telefone2'
                                            />
                                        )}
                                    />
                                    {errors.telefone2 && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-telefone2'>
                                            {errors.telefone2.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='cep'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='CEP'
                                                onChange={onChange}
                                                placeholder='CEP'
                                                error={Boolean(errors.cep)}
                                                aria-describedby='validation-schema-cep'
                                            />
                                        )}
                                    />
                                    {errors.cep && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-cep'>
                                            {errors.cep.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='logradouro'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='Logradouro'
                                                onChange={onChange}
                                                placeholder='Logradouro'
                                                error={Boolean(errors.logradouro)}
                                                aria-describedby='validation-schema-logradouro'
                                            />
                                        )}
                                    />
                                    {errors.logradouro && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-logradouro'>
                                            {errors.logradouro.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='complemento'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='Complemento'
                                                onChange={onChange}
                                                placeholder='Complemento'
                                                error={Boolean(errors.complemento)}
                                                aria-describedby='validation-schema-complemento'
                                            />
                                        )}
                                    />
                                    {errors.complemento && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-complemento'>
                                            {errors.complemento.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='numero'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='Número'
                                                onChange={onChange}
                                                placeholder='Número'
                                                error={Boolean(errors.numero)}
                                                aria-describedby='validation-schema-numero'
                                            />
                                        )}
                                    />
                                    {errors.numero && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-numero'>
                                            {errors.numero.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='bairro'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='Bairro'
                                                onChange={onChange}
                                                placeholder='Bairro'
                                                error={Boolean(errors.bairro)}
                                                aria-describedby='validation-schema-bairro'
                                            />
                                        )}
                                    />
                                    {errors.bairro && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-bairro'>
                                            {errors.bairro.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='cidade'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='Cidade'
                                                onChange={onChange}
                                                placeholder='Cidade'
                                                error={Boolean(errors.cidade)}
                                                aria-describedby='validation-schema-cidade'
                                            />
                                        )}
                                    />
                                    {errors.cidade && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-cidade'>
                                            {errors.cidade.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='uf'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='UF'
                                                onChange={onChange}
                                                placeholder='UF'
                                                error={Boolean(errors.uf)}
                                                aria-describedby='validation-schema-uf'
                                            />
                                        )}
                                    />
                                    {errors.uf && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-uf'>
                                            {errors.uf.message}
                                        </FormHelperText>
                                    )}
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
                btnCancelar
                btnConfirmar
            />
        </>
    )
}

export default FormUnidade

import Router from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { api } from 'src/configs/api'
import { Card, CardContent, Grid, FormControl, TextField, Typography } from '@mui/material'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormHelperText } from '@mui/material'
import toast from 'react-hot-toast'
import DialogForm from 'src/components/Defaults/Dialogs/Dialog'
import { formType } from 'src/configs/defaultConfigs'
import FormHeader from '../../Defaults/FormHeader'
import { backRoute } from 'src/configs/defaultConfigs'
import { toastMessage } from 'src/configs/defaultConfigs'
import { cnpjMask, cellPhoneMask, cepMask, ufMask } from 'src/configs/masks'
import { validationCNPJ } from 'src/configs/validations'
import { formatDate } from 'src/configs/conversions'

const FormUnidade = () => {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState('')
    const { id } = Router.query
    const router = Router
    const type = formType(router.pathname) // Verifica se é novo ou edição
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const inputRef = useRef(null)

    const schema = yup.object().shape({
        nomeFantasia: yup.string().required(''),
        razaoSocial: yup.string().nullable(),
        cnpj: yup
            .string()
            .nullable()

            // .required()
            .test('', '', function (value) {
                const { errorCnpj } = this.parent
                if (errorCnpj) {
                    return false
                }

                return validationCNPJ(value)
            }),
        errorCnpj: yup.boolean().notRequired(),
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
        reset,
        watch // Para ver o valor do campo
    } = useForm({
        // defaultValues: {},
        // mode: 'onChange',
        resolver: yupResolver(schema)
    })

    // Função que busca o CEP
    const handleCep = async cep => {
        if (cep.length == 9) {
            // Obter apenas núemros da string
            const cepNumber = cep.replace(/\D/g, '')
            api.get('https://viacep.com.br/ws/' + cepNumber + '/json/').then(response => {
                if (response.data.localidade) {
                    reset({
                        ...watch(),
                        logradouro: response.data.logradouro,
                        bairro: response.data.bairro,
                        cidade: response.data.localidade,
                        uf: response.data.uf
                    })
                    toast.success('Endereço encontrado!')
                } else {
                    toast.error('Endereço não encontrado!')
                }
            })
        }
    }

    // Função que atualiza os dados ou cria novo dependendo do tipo da rota
    const onSubmit = async datas => {
        const data = {
            ...datas,
            dataCadastro: formatDate(datas.dataCadastro, 'YYYY-MM-DD')
        }

        try {
            if (type === 'new') {
                await api.post(`${staticUrl}/novo`, data)
                // router.push(staticUrl)
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
                setData(response.data)
                console.log(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        getData()
        if (type === 'new') {
            inputRef.current.focus()
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
                                                aria-describedby='validation-schema-nomeFantasia'
                                                inputRef={inputRef}
                                            />
                                        )}
                                    />
                                    {errors.nomeFantasia && (
                                        <FormHelperText
                                            sx={{ color: 'error.main' }}
                                            id='validation-schema-nomeFantasia'
                                        >
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
                                                placeholder='Razão Social'
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
                                                value={cnpjMask(value ?? '')}
                                                label='CNPJ'
                                                onChange={onChange}
                                                placeholder='CNPJ'
                                                error={Boolean(errors.cnpj)}
                                                aria-describedby='validation-schema-cnpj'
                                                inputProps={{ maxLength: 18 }}
                                            />
                                        )}
                                    />
                                    {errors.cnpj && (
                                        <FormHelperText
                                            sx={{ color: 'error.main' }}
                                            id='validation-schema-cnpj'
                                        ></FormHelperText>
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
                                        name='telefone1'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={cellPhoneMask(value ?? '')}
                                                label='Telefone 1'
                                                onChange={onChange}
                                                placeholder='Telefone 1'
                                                error={Boolean(errors.telefone1)}
                                                aria-describedby='validation-schema-telefone1'
                                                inputProps={{ maxLength: 15 }}
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
                                                value={cellPhoneMask(value ?? '')}
                                                label='Telefone 2'
                                                onChange={onChange}
                                                placeholder='Telefone 2'
                                                error={Boolean(errors.telefone2)}
                                                aria-describedby='validation-schema-telefone2'
                                                inputProps={{ maxLength: 15 }}
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
                                                value={cepMask(value ?? '')}
                                                label='CEP'
                                                onChange={e => {
                                                    onChange(e)
                                                    handleCep(e.target.value)
                                                }}
                                                placeholder='CEP'
                                                error={Boolean(errors.cep)}
                                                aria-describedby='validation-schema-cep'
                                                inputProps={{ maxLength: 9 }}
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
                                                label='Cidade'
                                                onChange={onChange}
                                                placeholder='Cidade'
                                                error={Boolean(errors.cidade)}
                                                aria-describedby='validation-schema-cidade'
                                                value={value ?? ''}
                                                defaultValue='aaaaa'
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
                                                value={ufMask(value ?? '')}
                                                label='UF'
                                                onChange={onChange}
                                                placeholder='UF'
                                                error={Boolean(errors.uf)}
                                                aria-describedby='validation-schema-uf'
                                                inputProps={{ maxLength: 2 }}
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
            {type === 'edit' && (
                <Typography variant='caption' sx={{ display: 'flex', justifyContent: 'end', p: 4 }}>
                    Data de cadastro:
                    {formatDate(data.dataCadastro, 'DD/MM/YYYY')}
                </Typography>
            )}

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

export default FormUnidade

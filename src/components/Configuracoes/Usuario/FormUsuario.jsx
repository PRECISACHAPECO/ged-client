import Router from 'next/router'
import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import Icon from 'src/@core/components/icon'

import {
    Card,
    CardContent,
    Grid,
    FormControl,
    TextField,
    Button,
    FormControlLabel,
    Typography,
    Autocomplete,
    Box,
    Checkbox
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
import { AuthContext } from 'src/context/AuthContext'

const FormUsuario = () => {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState()
    const { id } = Router.query
    const router = Router
    const type = formType(router.pathname) // Verifica se é novo ou edição
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const { user, loggedUnity } = useContext(AuthContext)

    const schema = yup.object().shape({
        nome: yup.string().required('Campo obrigatório')
    })

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        register
    } = useForm({
        // defaultValues: {},
        // mode: 'onChange',
        resolver: yupResolver(schema)
    })

    console.log('errors', errors)

    // Função que atualiza os dados ou cria novo dependendo do tipo da rota
    const onSubmit = async values => {
        try {
            if (type === 'new') {
                await api.post(`${staticUrl}/novo`, values)
                router.push(staticUrl)
                toast.success(toastMessage.successNew)
                reset(values)
            } else if (type === 'edit') {
                await api.put(`${staticUrl}/${id}`, values)
                toast.success(toastMessage.successUpdate)
                console.log('🚀 ~ oNSUBMIT:', values)
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

    // Função que adiciona uma nova unidade
    const addUnity = () => {
        const newUnity = [...data.units]

        newUnity.push({
            unidade: null,
            profissao: null,
            cargos: [],
            status: true
        })

        setData({ ...data, units: newUnity })
    }

    // Função que traz os dados quando carrega a página e atualiza quando as dependências mudam
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await api.get(
                    `${staticUrl}/${id}?unidadeID=${loggedUnity.unidadeID}&admin=${user.admin}`
                )
                reset(response.data)
                setData(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [])

    console.log('data', data)

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
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
                            <Grid item xs={12} md={4}>
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

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='dataNascimento'
                                        control={control}
                                        type='date'
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='Data de Nascimento'
                                                onChange={onChange}
                                                placeholder='Data de Nascimento'
                                                error={Boolean(errors.dataNascimento)}
                                                aria-describedby='validation-schema-dataNascimento'
                                            />
                                        )}
                                    />
                                    {errors.dataNascimento && (
                                        <FormHelperText
                                            sx={{ color: 'error.main' }}
                                            id='validation-schema-dataNascimento'
                                        >
                                            {errors.dataNascimento.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={3}>
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

                            <Grid item xs={12} md={1}>
                                <FormControl>
                                    <Controller
                                        name='status'
                                        control={control}
                                        rules={{ required: false }}
                                        render={({ field: { value, onChange } }) => (
                                            <FormControlLabel
                                                checked={type === 'new' ? true : value ?? false}
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
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-status'>
                                            {errors.status.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='cpf'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='CPF'
                                                onChange={onChange}
                                                placeholder='CPF'
                                                error={Boolean(errors.cpf)}
                                                aria-describedby='validation-schema-cpf'
                                            />
                                        )}
                                    />
                                    {errors.cpf && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-cpf'>
                                            {errors.cpf.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='rg'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label='RG'
                                                onChange={onChange}
                                                placeholder='RG'
                                                error={Boolean(errors.role)}
                                                aria-describedby='validation-schema-rg'
                                            />
                                        )}
                                    />
                                    {errors.rg && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-rg'>
                                            {errors.rg.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            {user.admin == 0 && (
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <Controller
                                            name='profissao'
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    value={value ?? ''}
                                                    label='Profissão'
                                                    onChange={onChange}
                                                    placeholder='Profissão'
                                                    error={Boolean(errors.role)}
                                                    aria-describedby='validation-schema-profissao'
                                                />
                                            )}
                                        />
                                        {errors.profissao && (
                                            <FormHelperText
                                                sx={{ color: 'error.main' }}
                                                id='validation-schema-profissao'
                                            >
                                                {errors.profissao.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            )}

                            {user.admin == 0 && (
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <Controller
                                            name='registroConselhoClasse'
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    value={value ?? ''}
                                                    label='Número do registro de conselho'
                                                    onChange={onChange}
                                                    placeholder='Número do registro de conselho
                                                    '
                                                    error={Boolean(errors.role)}
                                                    aria-describedby='validation-schema-registroConselhoClasse
                                                    '
                                                />
                                            )}
                                        />
                                        {errors.registroConselhoClasse && (
                                            <FormHelperText
                                                sx={{ color: 'error.main' }}
                                                id='validation-schema-registroConselhoClasse
                                            '
                                            >
                                                {errors.registroConselhoClasse.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                {user.admin == 1 && (
                    <Card sx={{ mt: 4 }}>
                        <CardContent>
                            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                Unidades
                            </Typography>
                            {/* Lista as unidades do usuario */}
                            {data &&
                                data.units &&
                                data.units.map((unit, indexUnit) => (
                                    <>
                                        <Grid container spacing={5} sx={{ my: 2 }}>
                                            {/* Unidade */}
                                            <Grid item xs={12} md={3}>
                                                <Autocomplete
                                                    options={data.unidadesOptions}
                                                    getOptionLabel={option => option.nome}
                                                    defaultValue={unit?.unidade ?? null}
                                                    renderInput={params => (
                                                        <TextField
                                                            {...params}
                                                            label='Selecione a unidade'
                                                            placeholder='Selecionar unidade'
                                                            name={`units[${indexUnit}].unidade`}
                                                            {...register(`units[${indexUnit}].unidade`, {
                                                                required: true
                                                            })}
                                                            error={Boolean(errors.formulario)}
                                                            aria-describedby='formulario-error'
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            {/* Profissão */}
                                            <Grid item xs={12} md={3}>
                                                <Autocomplete
                                                    options={data.profissaoOptions}
                                                    getOptionLabel={option => option.nome}
                                                    defaultValue={unit.profissao ?? null}
                                                    renderInput={params => (
                                                        <TextField
                                                            {...params}
                                                            label='Selecione a profissão'
                                                            placeholder='Selecione a profissão'
                                                            name={`profissaoOptions[${indexUnit}].nome`}
                                                            {...register(`profissaoOptions[${indexUnit}].nome`, {
                                                                required: true
                                                            })}
                                                            error={Boolean(errors.formulario)}
                                                            aria-describedby='formulario-error'
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            {/* Cargo */}
                                            <Grid item xs={12} md={5}>
                                                <Autocomplete
                                                    multiple
                                                    limitTags={2}
                                                    options={data.cargosOptions}
                                                    // id='autocomplete-limit-tags'
                                                    getOptionLabel={option => option.nome || ''}
                                                    defaultValue={unit.cargos ?? []}
                                                    renderInput={params => (
                                                        <TextField
                                                            {...params}
                                                            label='Cargos'
                                                            placeholder='Cargos'
                                                            // name={`profissaoOptions[${indexUnit}].nome2`}
                                                            // {...register(`profissaoOptions[${indexUnit}].nome2`, {
                                                            //     required: true
                                                            // })}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            {/* Status */}
                                            <Grid item xs={12} md={1}>
                                                {indexUnit == 0 && <Typography variant='body2'>Status</Typography>}
                                                <Checkbox
                                                    name='status'
                                                    {...register('status', { required: true })}
                                                    defaultChecked={true}
                                                />
                                            </Grid>
                                        </Grid>
                                    </>
                                ))}

                            {/* Adicionar unidade */}
                            <Grid container spacing={5} sx={{ my: 2 }}>
                                <Grid item xs={12} md={3}>
                                    <Button
                                        startIcon={<Icon icon='material-symbols:add-circle-outline-rounded' />}
                                        variant='outlined'
                                        onClick={() => {
                                            addUnity()
                                        }}
                                    >
                                        Inserir unidade
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}
            </form>

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

export default FormUsuario

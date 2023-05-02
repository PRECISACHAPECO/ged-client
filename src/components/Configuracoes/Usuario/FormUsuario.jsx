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

    // const schema = yup.object().shape({
    //     nome: yup.string().required('Campo obrigatório')
    // })

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
        // resolver: yupResolver(schema)
    })

    console.log('errors', errors)

    data &&
        data.units &&
        data.units.map((unit, index) => {
            setValue(`units[${index}].unidade`, unit.unidade)
            setValue(`units[${index}].profissao`, unit.profissao)
            // unit.cargos.map((cargo, indexCargo) => {
            //     setValue(`units[${index}].cargo`, cargo)
            // })
        })

    // Função que atualiza os dados ou cria novo dependendo do tipo da rota
    const onSubmit = async values => {
        console.log('🚀 ~ onSubmit:', values)
        // try {
        //     if (type === 'new') {
        //         await api.post(`${staticUrl}/novo`, values)
        //         router.push(staticUrl)
        //         toast.success(toastMessage.successNew)
        //         reset(values)
        //     } else if (type === 'edit') {
        //         await api.put(`${staticUrl}/${id}`, values)
        //         toast.success(toastMessage.successUpdate)
        //         console.log('🚀 ~ oNSUBMIT:', values)
        //     }
        // } catch (error) {
        //     if (error.response && error.response.status === 409) {
        //         toast.error(toastMessage.errorRepeated)
        //     } else {
        //         console.log(error)
        //     }
        // }
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
                setData(response.data)
                console.log('🚀 ~ getData:', response.data)
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <FormHeader
                        btnCancel
                        btnSave
                        handleSubmit={() => handleSubmit(onSubmit)}
                        btnDelete={type === 'edit' ? true : false}
                        onclickDelete={() => setOpen(true)}
                    />
                    <CardContent>
                        {data && (
                            <>
                                <Grid container spacing={5}>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <TextField
                                                defaultValue={data?.nome}
                                                label='Nome'
                                                placeholder='Nome'
                                                aria-describedby='validation-schema-nome'
                                                name='nome'
                                                {...register(`nome`, { required: true })}
                                                error={errors.nome}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <TextField
                                                defaultValue={data?.dataNascimento}
                                                label='Data de Nascimento'
                                                placeholder='Data de Nascimento'
                                                aria-describedby='validation-schema-nome'
                                                name='dataNascimento'
                                                {...register(`dataNascimento`, { required: true })}
                                                error={errors.dataNascimento}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <FormControl fullWidth>
                                            <TextField
                                                defaultValue={data?.email}
                                                label='E-mail'
                                                placeholder='E-mail'
                                                aria-describedby='validation-schema-nome'
                                                name='email'
                                                {...register(`email`, { required: true })}
                                                error={errors.email}
                                            />
                                        </FormControl>
                                    </Grid>

                                    {/* <Grid item xs={12} md={1}>
                                        <FormControl>
                                            <FormControlLabel
                                                // checked={type === 'new' ? true : value ?? false}
                                                onChange={value => setValue('status', value)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                label='Status'
                                                labelPlacement='top'
                                                sx={{ mr: 8 }}
                                                control={<Checkbox name='status' {...register(`status`)} />}
                                            />
                                        </FormControl>
                                    </Grid> */}

                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <TextField
                                                defaultValue={data?.cpf}
                                                label='CPF'
                                                placeholder='CPF'
                                                aria-describedby='validation-schema-nome'
                                                name='cpf'
                                                {...register(`cpf`, { required: true })}
                                                error={errors.cpf}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <TextField
                                                defaultValue={data?.rg}
                                                label='RG'
                                                placeholder='RG'
                                                aria-describedby='validation-schema-nome'
                                                name='rg'
                                                {...register(`rg`, { required: true })}
                                                error={errors.rg}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {user.admin == 0 && (
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    defaultValue={data?.profissao}
                                                    label='Profissão'
                                                    placeholder='Profissão'
                                                    aria-describedby='validation-schema-nome'
                                                    name='profissao'
                                                    {...register(`profissao`, { required: true })}
                                                    error={errors.profissao}
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}

                                    {user.admin == 0 && (
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    defaultValue={data?.registroConselhoClasse}
                                                    label='Registro Conselho Classe'
                                                    placeholder='Registro Conselho Classe'
                                                    aria-describedby='validation-schema-nome'
                                                    name='registroConselhoClasse'
                                                    {...register(`registroConselhoClasse`, { required: true })}
                                                    error={errors.registroConselhoClasse}
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}
                                </Grid>
                            </>
                        )}
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
                                                    name={`units[${indexUnit}].unidade`}
                                                    {...register(`units[${indexUnit}].unidade`, {
                                                        required: true
                                                    })}
                                                    onChange={(index, value) => {
                                                        const newData = value
                                                            ? {
                                                                  id: value?.unidadeID,
                                                                  nome: value?.nome
                                                              }
                                                            : ''
                                                        setValue(`units[${indexUnit}].unidade`, newData)
                                                    }}
                                                    renderInput={params => (
                                                        <TextField
                                                            {...params}
                                                            label='Selecione a unidade'
                                                            placeholder='Selecionar unidade'
                                                            aria-describedby='formulario-error'
                                                            error={errors.units?.[indexUnit]?.unidade}
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
                                                    name={`units[${indexUnit}].profissao`}
                                                    {...register(`units[${indexUnit}].profissao`, {
                                                        required: true
                                                    })}
                                                    onChange={(index, value) => {
                                                        const newData = value
                                                            ? {
                                                                  id: value?.profissaoID,
                                                                  nome: value?.nome
                                                              }
                                                            : ''
                                                        setValue(`units[${indexUnit}].profissao`, newData)
                                                    }}
                                                    renderInput={params => (
                                                        <TextField
                                                            {...params}
                                                            label='Selecione a profissão'
                                                            placeholder='Selecione a profissão'
                                                            aria-describedby='formulario-error'
                                                            error={errors.units?.[indexUnit]?.profissao}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            {/* Cargo(s) */}
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
                                                            name={`units[${indexUnit}].cargo[]`}
                                                            {...register(`units[${indexUnit}].cargo[]`, {
                                                                required: false
                                                            })}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            {/* Status */}
                                            <Grid item xs={12} md={1}>
                                                {indexUnit == 0 && <Typography variant='body2'>Status</Typography>}
                                                <Checkbox
                                                    name='status'
                                                    {...register('status', { required: false })}
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

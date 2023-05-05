// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import { cpfMask } from 'src/configs/masks'
import { validationCPF } from 'src/configs/validations'
import { useState } from 'react'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'src/configs/api'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const StepPersonalDetails = ({ handleNext, handlePrev, setDataGlobal, dataGlobal }) => {

    const schema = yup.object().shape({
        cpf: yup
            .string()
            .nullable()
            .required('CPF é obrigatório')
            .test('cpf', 'CPF inválido', function (value) {
                const { errorCpf } = this.parent
                if (errorCpf) {
                    return false
                }
                return validationCPF(value)
            }),
        nome: yup
            .string()
            .nullable()
            .when('cnpj', {
                is: (val) => dataGlobal?.usuario?.exists === false ? true : false,
                then: yup.string().required('Nome é obrigatório')
            }),
    })


    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    })


    const handleGetCpf = (cpf) => {
        if (cpf.length === 14 && validationCPF(cpf)) {
            api.post(`http://localhost:3333/api/registro`, { cpf: cpf }, { headers: { 'function-name': 'handleGetCpf' } }).then((res, err) => {
                if (res.data.length > 0) {
                    setDataGlobal({
                        ...dataGlobal,
                        usuario: {
                            fields: res.data[0],
                            exists: true
                        }
                    })
                } else {
                    setDataGlobal({
                        ...dataGlobal,
                        usuario: {
                            fields: {
                                cpf: cpf
                            },
                            exists: false
                        }
                    })
                }
            })
        } else {
            //? limpa todos os dados de unidade do dataGlobal, quando o length do cpf for menor que 14
            setDataGlobal({
                unidades: {
                    ...dataGlobal?.unidade,
                    fields: {
                        ...dataGlobal?.unidade?.fields,
                    }
                },
                usuario: {
                    exists: false,
                    fields: {
                    }
                }
            })
        }
    }

    console.log("dados atualizados: ", dataGlobal)


    const onSubmit = value => {
        setDataGlobal({
            ...dataGlobal,
            usuario: {
                ...dataGlobal.usuario,
                fields: {
                    ...dataGlobal.usuario.fields,
                    ...value
                }
            }
        })
        handleNext()
    }

    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 4 }}>
                <Typography variant='h5'>Informações do usuário</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Insira os detalhes do usuário</Typography>
            </Box>

            <Grid container spacing={5}>

                <Grid item xs={12} md={6}>
                    <TextField
                        label='CPF'
                        fullWidth
                        {...register('cpf', { required: true })}
                        error={errors.cpf && true}
                        helperText={errors.cpf && errors.cpf.message}
                        defaultValue={dataGlobal?.usuario?.fields?.cpf}
                        onChange={e => {
                            handleGetCpf(e.target.value)
                        }}
                        inputProps={{
                            maxLength: 14,
                            onChange: e => {
                                setValue('cpf', cpfMask(e.target.value))
                            }
                        }}


                    />
                </Grid>
                {
                    dataGlobal && dataGlobal?.usuario?.exists === false && (
                        <Grid item xs={12} md={6}>
                            <TextField
                                label='Nome'
                                fullWidth
                                {...register('nome', { required: true })}
                                defaultValue={dataGlobal?.usuario?.fields?.nome}
                                error={errors.nome && true}
                                helperText={errors.nome && errors.nome.message}
                            />
                        </Grid>
                    )
                }

                {
                    dataGlobal && dataGlobal?.usuario?.exists === true && (
                        <Grid item xs={12} md={12}>
                            <h1>CPF já cadastrado</h1>
                            <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.usuario?.fields.nome
                            }</Typography>

                        </Grid>
                    )
                }

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            color='secondary'
                            variant='contained'
                            onClick={handlePrev}
                            startIcon={<Icon icon='mdi:chevron-left' fontSize={20} />}
                        >
                            Anterior
                        </Button>
                        <Button type='submit' variant='contained' onClick={handleSubmit} endIcon={<Icon icon='mdi:chevron-right' fontSize={20} />}>
                            Proximo
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </form >
    )
}

export default StepPersonalDetails

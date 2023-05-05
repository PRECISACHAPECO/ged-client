// ** React Imports

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'src/configs/api'
import { useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { cnpjMask } from 'src/configs/masks'
import { validationCNPJ } from 'src/configs/validations'
import Router from 'next/router'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { getNativeSelectUtilityClasses } from '@mui/material'
import { set } from 'nprogress'

const StepAccountDetails = ({ handleNext, setDataGlobal, dataGlobal, }) => {
    const router = Router
    const rota = router.pathname

    const schema = yup.object().shape({
        cnpj: yup
            .string()
            .nullable()
            .required('CNPJ é obrigatório')
            .test('cnpj', 'CNPJ inválido', function (value) {
                const { errorCnpj } = this.parent
                if (errorCnpj) {
                    return false
                }
                return validationCNPJ(value)
            }),
        // Nome sera sera obrigatório se !validationCnpj
        nomeFantasia: yup
            .string()
            .nullable()
            .when('cnpj', {
                is: (val) => dataGlobal?.unidade?.exists === false ? true : false,
                then: yup.string().required('Nome Fantasia é obrigatório')
            }),
        razaoSocial: yup
            .string()
            .nullable()
            .when('cnpj', {
                is: (val) => dataGlobal?.unidade?.exists === false ? true : false,
                then: yup.string().required('Razão Social é obrigatório')
            }),
        email: yup
            .string()
            .email('Email inválido')
            .nullable()
            .when('cnpj', {
                is: (val) => dataGlobal?.unidade?.exists === false ? true : false,
                then: yup.string().required('Email é obrigatório')
            }),
        cidade: yup
            .string()
            .nullable()
            .when('cnpj', {
                is: (val) => dataGlobal?.unidade?.exists === false ? true : false,
                then: yup.string().required('Cidade é obrigatório')
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

    const handleGetCnpj = (cnpj) => {
        if (cnpj.length === 18 && validationCNPJ(cnpj)) {
            api.post(`http://localhost:3333/api/registro`, { cnpj: cnpj }, { headers: { 'function-name': 'handleGetCnpj' } }).then((response, err) => {
                if (response.data.length > 0) {
                    // Quero manter oque ja tem no dataGlobal e adicionar o que vem do response.data[0]
                    setDataGlobal({
                        unidade: {
                            exists: true,
                            fields: {
                                ...dataGlobal?.unidade?.fields,
                                ...response.data[0]
                            },
                        },
                        usuario: {
                            ...dataGlobal?.usuario,
                            fields: {
                                ...dataGlobal?.usuario?.fields,
                            }
                        }
                    })

                } else {
                    setDataGlobal({
                        unidade: {
                            ...dataGlobal?.unidade,
                            exists: false,
                            fields: {
                                ...dataGlobal?.unidade?.fields,
                                cnpj: cnpj,
                            }
                        },
                        usuario: {
                            ...dataGlobal?.usuario,
                            fields: {
                                ...dataGlobal?.usuario.fields,
                            }
                        }
                    })
                }
            })
        } else {
            // limpar todos os dados de unidade do dataGlobal 
            setDataGlobal({
                unidades: {
                    exists: false,
                    fields: {
                    }
                },
                usuario: {
                    ...dataGlobal?.usuario,
                    fields: {
                        ...dataGlobal?.usuario?.fields,
                    }
                }
            })
        }
    }

    console.log("validando ", dataGlobal)

    const onSubmit = value => {
        setDataGlobal({
            unidade: {
                ...dataGlobal?.unidade,
                fields: {
                    ...dataGlobal?.unidade.fields,
                    ...value
                }
            },
            usuario: {
                ...dataGlobal?.usuario,
                fields: {
                    ...dataGlobal?.usuario?.fields,
                }
            }

        })
        // }
        handleNext()
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant='h5'>Informações da unidade</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Insira os detalhes da unidade</Typography>
                </Box>
                <Grid container spacing={5}>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label='CNPJ'
                            fullWidth
                            {...register('cnpj', { required: true })}
                            error={errors.cnpj && true}
                            helperText={errors.cnpj && errors.cnpj.message}
                            defaultValue={dataGlobal?.unidade?.fields?.cnpj}
                            onChange={e => {
                                handleGetCnpj(e.target.value)
                            }}

                            inputProps={{
                                maxLength: 18,
                                onChange: e => {
                                    setValue('cnpj', cnpjMask(e.target.value))

                                }
                            }}
                        />
                    </Grid>

                    {
                        dataGlobal && dataGlobal?.unidade?.exists === false && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label='Nome Fantasia'
                                        defaultValue={dataGlobal?.unidade?.fields?.nomeFantasia}
                                        {...register('nomeFantasia', { required: true })}
                                        error={errors.nomeFantasia && true}
                                        helperText={errors.nomeFantasia && errors.nomeFantasia.message}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label='Razão Social'
                                        defaultValue={dataGlobal?.unidade?.fields?.razaoSocial}
                                        {...register('razaoSocial', { required: true })}
                                        error={errors.razaoSocial && true}
                                        helperText={errors.razaoSocial && errors.razaoSocial.message}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label='Email'
                                        defaultValue={dataGlobal?.unidade?.fields?.email}
                                        {...register('email', { required: true })}
                                        error={errors.email && true}
                                        helperText={errors.email && errors.email.message}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label='Cidade'
                                        defaultValue={dataGlobal?.unidade?.fields?.cidade}
                                        {...register('cidade', { required: true })}
                                        error={errors.cidade && true}
                                        helperText={errors.cidade && errors.cidade.message}
                                    />
                                </Grid>

                            </>
                        )
                    }

                    {
                        dataGlobal && dataGlobal?.unidade?.exists === true && (
                            <Grid item xs={12} md={12}>
                                <h3>CNPJ já cadastrado</h3>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Typography sx={{ color: 'text.primary' }}>Nome fantasia:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.unidade?.fields.nomeFantasia}</Typography>

                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Typography sx={{ color: 'text.primary' }}>Responsável:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.unidade?.fields.responsavel}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Typography sx={{ color: 'text.primary' }}>Email:</Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.unidade?.fields.email}</Typography>
                                </Box>
                            </Grid>
                        )
                    }

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                disabled
                                variant='contained'
                                startIcon={<Icon icon='mdi:chevron-left' fontSize={20} />}
                            >
                                Anterior
                            </Button>
                            <Button
                                type='submit'
                                variant='contained'
                                onClick={handleSubmit}
                                endIcon={<Icon icon='mdi:chevron-right' fontSize={20} />}
                            >
                                Proximo
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}

export default StepAccountDetails

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
import { OutlinedInput } from '@mui/material'
import IconButton from '@mui/material/IconButton'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'src/configs/api'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const StepPersonalDetails = ({ handleNext, handlePrev, setDataGlobal, dataGlobal }) => {
    const [values, setValues] = useState({
        showPassword: false,
        showConfirmPassword: false
    })

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword })
    }

    const handleMouseDownPassword = event => {
        event.preventDefault()
    }

    const handleClickShowConfirmPassword = () => {
        setValues({ ...values, showConfirmPassword: !values.showConfirmPassword })
    }

    const handleMouseDownConfirmPassword = event => {
        event.preventDefault()
    }


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
            .when('cpf', {
                is: (val) => dataGlobal?.usuario?.exists === false ? true : false,
                then: yup.string().required('Nome é obrigatório')
            }),

        email: yup
            .string()
            .nullable()
            .when('cpf', {
                is: (val) => dataGlobal?.usuario?.exists === false ? true : false,
                then: yup.string().required('Email é obrigatório')
            }),

        senha: yup
            .string()
            .when('cpf', {
                is: (val) => dataGlobal?.usuario?.exists === false ? true : false,
                then: yup.string().required('Senha é obrigatório')
            }),

        confirmaSenha: yup
            .string()
            .oneOf([yup.ref('senha')], 'As senhas não conferem')
            .when('cpf', {
                is: (val) => dataGlobal?.usuario?.exists === false ? true : false,
                then: yup.string().required('Confirmação de senha é obrigatório')
            })
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
            api.post(`http://localhost:3333/api/registro`, { cpf: cpf }, { headers: { 'function-name': 'handleGetCpf' } }).then((response, err) => {
                if (response.data.length > 0) {
                    setDataGlobal({
                        usuario: {
                            exists: true,
                            fields: {
                                ...dataGlobal?.usuario?.fields,
                                ...response.data[0]
                            },
                        },
                        unidade: {
                            ...dataGlobal?.unidade,
                            fields: {
                                ...dataGlobal?.unidade?.fields,
                            }
                        }
                    })
                } else {
                    setDataGlobal({
                        usuario: {
                            ...dataGlobal?.usuario,
                            exists: false,
                            fields: {
                                ...dataGlobal?.usuario?.fields,
                                cpf: cpf,
                            }
                        },
                        unidade: {
                            ...dataGlobal?.unidade,
                            fields: {
                                ...dataGlobal?.unidade.fields,
                            }
                        }
                    })
                }
            })
        } else {
            //? limpa todos os dados de unidade do dataGlobal, quando o length do cpf for menor que 14
            setDataGlobal({
                usuario: {
                    exists: null,
                    fields: {
                    }
                },
                unidade: {
                    ...dataGlobal?.unidade,
                    fields: {
                        ...dataGlobal?.unidade?.fields,
                    }
                }
            })
        }
    }

    console.log("dados atualizados: ", dataGlobal)


    const onSubmit = value => {
        setDataGlobal({
            usuario: {
                ...dataGlobal?.usuario,
                fields: {
                    ...dataGlobal?.usuario.fields,
                    ...value
                }
            },
            unidade: {
                ...dataGlobal?.unidade,
                fields: {
                    ...dataGlobal?.unidade?.fields,
                }
            }

        })
        // }
        handleNext()
    }

    console.log("erros")

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
                        <>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label='Nome'
                                    fullWidth
                                    name='nome'
                                    {...register('nome', { required: true })}
                                    defaultValue={dataGlobal?.usuario?.fields?.nome}
                                    error={errors.nome && true}
                                    helperText={errors.nome && errors.nome.message}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label='Email'
                                    name='email'
                                    fullWidth
                                    {...register('email', { required: true })}
                                    defaultValue={dataGlobal?.usuario?.fields?.email}
                                    error={errors.email && true}
                                    helperText={errors.email && errors.email.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor='input-password' color={errors.senha ? 'error' : ''}>Senha</InputLabel>
                                    <OutlinedInput
                                        label='Senha'
                                        id='input-password'
                                        type={values.showPassword ? 'text' : 'password'}
                                        name='senha'
                                        {...register('senha')}
                                        endAdornment={
                                            <InputAdornment position='end'>
                                                <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                                                    <Icon icon={values.showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        error={errors.senha && true}
                                        helperText={errors.senha && errors.senha.message}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor='input-confirm-password' style={{
                                        color: errors.confirmaSenha && 'red'
                                    }}  >Confirme a senha</InputLabel>
                                    <OutlinedInput
                                        label='Confirme a senha'
                                        name='confirmaSenha'
                                        {...register('confirmaSenha')}
                                        id='input-confirm-password'
                                        type={values.showConfirmPassword ? 'text' : 'password'} // altere o tipo para 'password'
                                        endAdornment={
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    edge='end'
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDownConfirmPassword}
                                                >
                                                    <Icon icon={values.showConfirmPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        error={errors.confirmaSenha && true}
                                    />
                                    <Typography variant='caption' sx={{ color: 'error.main' }}>
                                        {errors.confirmaSenha && errors.confirmaSenha.message}
                                    </Typography>
                                </FormControl>
                            </Grid>
                        </>
                    )
                }

                {
                    dataGlobal && dataGlobal?.usuario?.exists === true && (
                        <Grid item xs={12} md={12}>
                            <h3>CPF já cadastrado</h3>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Typography sx={{ color: 'text.primary' }}>Usuário:</Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.usuario?.fields.nome}</Typography>

                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Typography sx={{ color: 'text.primary' }}>Email:</Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.usuario?.fields.email}</Typography>
                            </Box>
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

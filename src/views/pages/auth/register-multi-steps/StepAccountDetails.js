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
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import { OutlinedInput } from '@mui/material'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Link from 'next/link'

const StepAccountDetails = ({ handleNext, setDataGlobal, dataGlobal, }) => {
    const router = Router
    const rota = router.pathname

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
        nomeFantasia: yup
            .string()
            .nullable()
            .when('cnpj', {
                is: (val) => dataGlobal?.usuario?.exists === false ? true : false,
                then: yup.string().required('Nome Fantasia é obrigatório')
            }),
        email: yup
            .string()
            .email('Email inválido')
            .nullable()
            .when('cnpj', {
                is: (val) => dataGlobal?.usuario?.exists === false ? true : false,
                then: yup.string().required('Email é obrigatório')
            }),
        razaoSocial: yup
            .string()
            .nullable()
            .when('cnpj', {
                is: (val) => dataGlobal?.usuario?.exists === false ? true : false,
                then: yup.string().required('Cidade é obrigatório')
            }),
        senha: yup
            .string()
            .when('cnpj', {
                is: (val) => dataGlobal?.usuario?.exists === false ? true : false,
                then: yup.string().required('Senha é obrigatório')
            }),

        confirmaSenha: yup
            .string()
            .oneOf([yup.ref('senha')], 'As senhas não conferem')
            .when('cnpj', {
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

    const handleGetCnpj = (cnpj) => {
        if (cnpj.length === 18 && validationCNPJ(cnpj)) {
            api.post(`http://localhost:3333/api/registro`, { cnpj: cnpj }, { headers: { 'function-name': 'handleGetCnpj' } }).then((response, err) => {
                if (response.data.length > 0) {
                    // Quero manter oque ja tem no dataGlobal e adicionar o que vem do response.data[0]
                    setDataGlobal({
                        usuario: {
                            ...dataGlobal?.usuario,
                            exists: true,
                            fields: {
                                ...dataGlobal?.usuario?.fields,
                                ...response.data[0]
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
                                cnpj: cnpj
                            }
                        }
                    })
                }
            })
        } else {
            // limpar todos os dados de usuario do dataGlobal 
            setDataGlobal({
                usuario: {
                    ...dataGlobal?.usuario,
                    exists: null,
                    fields: {
                        ...dataGlobal?.usuario?.fields,
                    }
                }
            })
        }
    }

    const onSubmit = value => {
        handleNext(value)
        setDataGlobal({
            usuario: {
                ...dataGlobal?.usuario,
                fields: {
                    ...dataGlobal?.usuario?.fields,
                    ...value
                }
            }
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant='h5'>Informações do usuário</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Insira os detalhes da usuario</Typography>
                </Box>
                <Grid container spacing={5}>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label='CNPJ'
                            fullWidth
                            {...register('cnpj', { required: true })}
                            error={errors.cnpj && true}
                            helperText={errors.cnpj && errors.cnpj.message}
                            defaultValue={dataGlobal?.usuario?.fields?.cnpj}
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
                        dataGlobal && dataGlobal?.usuario?.exists === false && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label='Nome Fantasia'
                                        defaultValue={dataGlobal?.usuario?.fields?.nomeFantasia}
                                        {...register('nomeFantasia', { required: true })}
                                        error={errors.nomeFantasia && true}
                                        helperText={errors.nomeFantasia && errors.nomeFantasia.message}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label='Razão Social'
                                        defaultValue={dataGlobal?.usuario?.fields?.razaoSocial}
                                        {...register('razaoSocial', { required: true })}
                                        error={errors.razaoSocial && true}
                                        helperText={errors.razaoSocial && errors.razaoSocial.message}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label='Email Institucional'
                                        defaultValue={dataGlobal?.usuario?.fields?.email}
                                        {...register('email', { required: true })}
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
                                <h3>CNPJ já cadastrado</h3>
                                <Box sx={{ display: 'flex', gap: '100px' }}>
                                    <Box>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Typography sx={{ color: 'text.primary' }}>Responsável:</Typography>
                                            <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.usuario?.fields.nome}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Typography sx={{ color: 'text.primary' }}>Email Institucional:</Typography>
                                            <Typography sx={{ color: 'text.secondary' }}>{dataGlobal?.usuario?.fields.email}</Typography>
                                        </Box>

                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Link href='#'>Fazer login</Link>
                                        <Link href='#'>Esqueceu a senha?</Link>
                                    </Box>
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
                                disabled={dataGlobal?.usuario?.exists === true}
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

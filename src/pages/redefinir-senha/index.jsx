// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'
import { api } from 'src/configs/api'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustrationsV1'
import Logo from 'src/components/Defaults/Logo'
import { useForm, Controller } from 'react-hook-form'
import Router from 'next/router'
import { toast } from 'react-hot-toast'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
    [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const ResetPassword = () => {
    // ** States
    const [values, setValues] = useState({
        showNewPassword: false,
        showConfirmNewPassword: false
    })
    const router = Router
    const type = router.query.type

    // ** Hook
    const theme = useTheme()

    // Handle New Password
    const handleNewPasswordChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value })
    }

    const handleClickShowNewPassword = () => {
        setValues({ ...values, showNewPassword: !values.showNewPassword })
    }

    const handleMouseDownNewPassword = event => {
        event.preventDefault()
    }

    // Handle Confirm New Password
    const handleConfirmNewPasswordChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value })
    }

    const handleClickShowConfirmNewPassword = () => {
        setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
    }

    const handleMouseDownConfirmNewPassword = event => {
        event.preventDefault()
    }

    const {
        handleSubmit,
        formState: { errors },
        register,
        watch
    } = useForm({})

    const onSubmit = value => {
        const usuarioID = router.query.userId
        const data = {
            senha: value.newPassword,
            usuarioID
        }
        api.post(`/esqueceuSenha/newPassword`, { data }).then(response => {
            if (response.status === 200) {
                toast.success('Senha redefinida com sucesso!')
                router.push(type === 'login' ? '/login' : '/fornecedor')
            } else {
                toast.error('Erro ao redefinir senha!')
            }
        })
    }

    return (
        <Box className='content-center'>
            <Card sx={{ zIndex: 1 }}>
                <CardContent sx={{ p: theme => `${theme.spacing(15.5, 7, 8)} !important` }}>
                    <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Logo />
                    </Box>
                    <Box sx={{ mb: 6 }}>
                        <Typography variant='h5' sx={{ mb: 1.5, letterSpacing: '0.18px', fontWeight: 600 }}>
                            Redefinir senha 🔒
                        </Typography>
                        <Typography variant='body2'>
                            Sua nova senha deve ser diferente das senhas usadas anteriormente
                        </Typography>
                    </Box>
                    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <InputLabel
                                htmlFor='auth-reset-password-new-password'
                                color={errors?.newPassword ? 'error' : ''}
                            >
                                Nova senha
                            </InputLabel>
                            <OutlinedInput
                                autoFocus
                                label='New Password'
                                name='newPassword'
                                id='auth-reset-password-new-password'
                                type={values.showNewPassword ? 'text' : 'password'}
                                {...register(`newPassword`, {
                                    required: true,
                                    validate: value => value.length >= 4 || 'A senha deve conter no mínimo 4 dígitos.'
                                })}
                                error={errors.newPassword}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            edge='end'
                                            onClick={handleClickShowNewPassword}
                                            aria-label='toggle password visibility'
                                            onMouseDown={handleMouseDownNewPassword}
                                        >
                                            <Icon
                                                icon={
                                                    values.showNewPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'
                                                }
                                            />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {errors.newPassword && (
                                <Typography variant='caption' color='error'>
                                    {errors.newPassword.message}
                                </Typography>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <InputLabel
                                htmlFor='input-confirmNewPassword'
                                color={errors?.confirmNewPassword ? 'error' : ''}
                            >
                                Confirme a senha
                            </InputLabel>
                            <OutlinedInput
                                label='Confirm Password'
                                name='confirmNewPassword'
                                id='auth-reset-password-confirm-password'
                                type={values.showConfirmNewPassword ? 'text' : 'password'}
                                {...register(`confirmNewPassword`, {
                                    required: true,
                                    // validar senha e confirmação de senha somente se houver valor em senha

                                    validate: {
                                        matchesPassword: value =>
                                            value === watch('newPassword') || 'As senhas não conferem.',
                                        minLength: value =>
                                            value.length >= 4 || 'A senha deve conter no mínimo 4 dígitos.'
                                    }
                                })}
                                error={errors.confirmNewPassword}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            edge='end'
                                            aria-label='toggle password visibility'
                                            onClick={handleClickShowConfirmNewPassword}
                                            onMouseDown={handleMouseDownConfirmNewPassword}
                                        >
                                            <Icon
                                                icon={
                                                    values.showConfirmNewPassword
                                                        ? 'mdi:eye-outline'
                                                        : 'mdi:eye-off-outline'
                                                }
                                            />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {errors.confirmNewPassword && (
                                <Typography variant='caption' color='error'>
                                    {errors.confirmNewPassword.message}
                                </Typography>
                            )}
                        </FormControl>
                        <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 5.25 }}>
                            Definir nova senha
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography
                                component={Link}
                                href={type === 'login' ? '/login' : '/fornecedor'}
                                sx={{
                                    display: 'flex',
                                    '& svg': { mr: 1.5 },
                                    alignItems: 'center',
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    justifyContent: 'center'
                                }}
                            >
                                <Icon icon='mdi:chevron-left' fontSize='2rem' />
                                <span>Volte ao login</span>
                            </Typography>
                        </Box>
                    </form>
                </CardContent>
            </Card>
            <FooterIllustrationsV1 />
        </Box>
    )
}
ResetPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ResetPassword.guestGuard = true

export default ResetPassword

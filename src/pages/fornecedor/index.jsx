// ** React Imports
import { useState, useContext } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

//* CNPJ Mask
import { cnpjMask } from '../../configs/masks'
import { validationCNPJ } from '../../configs/validations'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { AuthContext } from 'src/context/AuthContext'

import { fornecedorAuth } from 'src/hooks/fornecedorAuth'
import { FornecedorContext } from 'src/context/FornecedorContext'

import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)(({ theme }) => ({
    padding: theme.spacing(20),
    paddingRight: '0 !important',
    [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(10)
    }
}))

const LoginIllustration = styled('img')(({ theme }) => ({
    maxWidth: '48rem',
    [theme.breakpoints.down('xl')]: {
        maxWidth: '38rem'
    },
    [theme.breakpoints.down('lg')]: {
        maxWidth: '30rem'
    }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.up('md')]: {
        maxWidth: 400
    },
    [theme.breakpoints.up('lg')]: {
        maxWidth: 450
    }
}))

const BoxWrapper = styled(Box)(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.down('md')]: {
        maxWidth: 400
    }
}))

const TypographyStyled = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    letterSpacing: '0.18px',
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
    '& .MuiFormControlLabel-label': {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary
    }
}))

const schema = yup.object().shape({
    cnpj: yup
        .string()
        .required('O CNPJ é obrigatório')
        .min(18, 'O CNPJ deve ser preenchido completamente')
        .max(18)
        .test('O CNPJ é válido', 'O CNPJ é inválido', value => validationCNPJ(value)),
    password: yup.string().min(4, 'A senha deve conter pelo menos 4 caracteres').required('A senha é obrigatória')
})

const defaultValues = {
    password: '',
    cnpj: ''
}

const FornecedorPage = ({ units }) => {
    const [rememberMe, setRememberMe] = useState(true)
    const [showPassword, setShowPassword] = useState(false)

    // ** Hooks
    // const auth = useAuth()
    const auth = fornecedorAuth()

    const theme = useTheme()
    const bgColors = useBgColor()
    const { settings } = useSettings()
    const hidden = useMediaQuery(theme.breakpoints.down('md'))

    // ** Vars
    const { skin } = settings

    const {
        control,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onBlur',
        resolver: yupResolver(schema)
    })

    const onSubmit = data => {
        const { cnpj, password } = data
        auth.login({ cnpj, password, rememberMe }, () => {
            setError('cnpj', {
                type: 'manual',
                message: 'CNPJ e/ou senha inválidos!'
            })
        })
    }
    const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

    return (
        <>
            <Box className='content-right'>
                {!hidden ? (
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            position: 'relative',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <LoginIllustrationWrapper>
                            <LoginIllustration
                                alt='login-illustration'
                                src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
                            />
                        </LoginIllustrationWrapper>
                        <FooterIllustrationsV2 />
                    </Box>
                ) : null}
                <RightWrapper
                    sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}
                >
                    <Box
                        sx={{
                            p: 7,
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'background.paper'
                        }}
                    >
                        <BoxWrapper>
                            <Box
                                sx={{
                                    top: 30,
                                    left: 40,
                                    display: 'flex',
                                    position: 'absolute',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <svg
                                    width={47}
                                    fill='none'
                                    height={26}
                                    viewBox='0 0 268 150'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <rect
                                        rx='25.1443'
                                        width='50.2886'
                                        height='143.953'
                                        fill={theme.palette.primary.main}
                                        transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
                                    />
                                    <rect
                                        rx='25.1443'
                                        width='50.2886'
                                        height='143.953'
                                        fillOpacity='0.4'
                                        fill='url(#paint0_linear_7821_79167)'
                                        transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
                                    />
                                    <rect
                                        rx='25.1443'
                                        width='50.2886'
                                        height='143.953'
                                        fill={theme.palette.primary.main}
                                        transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
                                    />
                                    <rect
                                        rx='25.1443'
                                        width='50.2886'
                                        height='143.953'
                                        fill={theme.palette.primary.main}
                                        transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
                                    />
                                    <rect
                                        rx='25.1443'
                                        width='50.2886'
                                        height='143.953'
                                        fillOpacity='0.4'
                                        fill='url(#paint1_linear_7821_79167)'
                                        transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
                                    />
                                    <rect
                                        rx='25.1443'
                                        width='50.2886'
                                        height='143.953'
                                        fill={theme.palette.primary.main}
                                        transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
                                    />
                                    <defs>
                                        <linearGradient
                                            y1='0'
                                            x1='25.1443'
                                            x2='25.1443'
                                            y2='143.953'
                                            id='paint0_linear_7821_79167'
                                            gradientUnits='userSpaceOnUse'
                                        >
                                            <stop />
                                            <stop offset='1' stopOpacity='0' />
                                        </linearGradient>
                                        <linearGradient
                                            y1='0'
                                            x1='25.1443'
                                            x2='25.1443'
                                            y2='143.953'
                                            id='paint1_linear_7821_79167'
                                            gradientUnits='userSpaceOnUse'
                                        >
                                            <stop />
                                            <stop offset='1' stopOpacity='0' />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <Typography
                                    variant='h6'
                                    sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}
                                >
                                    {themeConfig.templateName}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 6 }}>
                                <TypographyStyled variant='h4'>{`Bem vindo Fornecedor`}</TypographyStyled>
                                <Typography variant='body2'>Digite seu CNPJ e senha para começar</Typography>
                            </Box>

                            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='cnpj'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <TextField
                                                autoFocus
                                                label='CNPJ'
                                                value={cnpjMask(value ?? '')}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                error={Boolean(errors.cnpj)}
                                                placeholder='00.000.000/0000-00'
                                                inputProps={{ maxLength: 18 }}
                                            />
                                        )}
                                    />
                                    {errors.cnpj && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.cnpj.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                                        Senha
                                    </InputLabel>
                                    <Controller
                                        name='password'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <OutlinedInput
                                                value={value}
                                                onBlur={onBlur}
                                                label='Senha'
                                                onChange={onChange}
                                                id='auth-login-v2-password'
                                                error={Boolean(errors.password)}
                                                type={showPassword ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position='end'>
                                                        <IconButton
                                                            edge='end'
                                                            onMouseDown={e => e.preventDefault()}
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            <Icon
                                                                icon={
                                                                    showPassword
                                                                        ? 'mdi:eye-outline'
                                                                        : 'mdi:eye-off-outline'
                                                                }
                                                                fontSize={20}
                                                            />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        )}
                                    />
                                    {errors.password && (
                                        <FormHelperText sx={{ color: 'error.main' }} id=''>
                                            {errors.password.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <Box
                                    sx={{
                                        mb: 4,
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <FormControlLabel
                                        label='Lembrar-me'
                                        control={
                                            <Checkbox
                                                checked={rememberMe}
                                                onChange={e => setRememberMe(e.target.checked)}
                                            />
                                        }
                                    />
                                    <Typography
                                        variant='body2'
                                        component={Link}
                                        href='/forgot-password'
                                        sx={{ color: 'primary.main', textDecoration: 'none' }}
                                    >
                                        Esqueceu sua senha?
                                    </Typography>
                                </Box>
                                <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                                    Entrar
                                </Button>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Typography sx={{ mr: 2, color: 'text.secondary' }}>
                                        É um fornecedor novo?
                                    </Typography>
                                    <Typography
                                        href='/registro'
                                        component={Link}
                                        sx={{ color: 'primary.main', textDecoration: 'none' }}
                                    >
                                        Registre-se
                                    </Typography>
                                </Box>
                            </form>
                        </BoxWrapper>
                    </Box>
                </RightWrapper>
            </Box>
        </>
    )
}
FornecedorPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
FornecedorPage.guestGuard = true

export default FornecedorPage

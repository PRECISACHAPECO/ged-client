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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { AuthContext } from 'src/context/AuthContext'

import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import DialogSelectUnit from 'src/components/Defaults/Dialogs/DialogSelectUnit'

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
    cpf: yup.string().required().min(14).max(14),
    password: yup.string().min(5).required()
})

const defaultValues = {
    password: '',
    cpf: ''
}

const LoginPage = ({ units }) => {
    const [rememberMe, setRememberMe] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    // ** Contexto que controla se usuário tentando logar precisar selecionar unidade ou não
    const { openModalSelectUnits, setOpenModalSelectUnits, unitsUser, setContextSelectedUnit } = useContext(AuthContext)

    // Abre modal para selecionar unidade
    const [openModalSelectUnit, setOpenModalSelectUnit] = useState(false)

    // Dados do usuário
    const [data, setData] = useState({})

    // Unidade selecionada
    const [selectedUnit, setSelectedUnit] = useState(null)

    // ** Hooks
    const auth = useAuth()
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
        const { cpf, password } = data
        const verifyUnits = true
        setData(data)
        auth.login({ cpf, password, rememberMe, verifyUnits }, () => {
            setError('cpf', {
                type: 'manual',
                message: 'CPF e/ou senha inválidos!'
            })
        })
    }
    const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

    const handleCloseModalSelectUnits = () => {
        setOpenModalSelectUnit(false)
        setOpenModalSelectUnits(null)
    }

    const handleConfirmUnit = () => {
        const { cpf, password } = data
        const verifyUnits = false
        setOpenModalSelectUnit(false)
        setContextSelectedUnit(selectedUnit)
        console.log('selectedUnit', selectedUnit)

        auth.login({ cpf, password, rememberMe, verifyUnits }, () => {
            setError('cpf', {
                type: 'manual',
                message: 'CPF e/ou senha inválidos!'
            })
        })
    }

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
                                <TypographyStyled variant='h5'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</TypographyStyled>
                                <Typography variant='body2'>
                                    Please sign-in to your account and start the adventure
                                </Typography>
                            </Box>

                            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='cpf'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <TextField
                                                autoFocus
                                                label='CPF'
                                                value={value}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                error={Boolean(errors.cpf)}
                                                placeholder='000.000.000-00'
                                            />
                                        )}
                                    />
                                    {errors.cpf && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.cpf.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                                        Password
                                    </InputLabel>
                                    <Controller
                                        name='password'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <OutlinedInput
                                                value={value}
                                                onBlur={onBlur}
                                                label='Password'
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
                                        label='Remember Me'
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
                                        Forgot Password?
                                    </Typography>
                                </Box>
                                <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                                    Login
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
                                        New on our platform?
                                    </Typography>
                                    <Typography
                                        href='/register'
                                        component={Link}
                                        sx={{ color: 'primary.main', textDecoration: 'none' }}
                                    >
                                        Create an account
                                    </Typography>
                                </Box>
                                <Divider
                                    sx={{
                                        '& .MuiDivider-wrapper': { px: 4 },
                                        mt: theme => `${theme.spacing(5)} !important`,
                                        mb: theme => `${theme.spacing(7.5)} !important`
                                    }}
                                >
                                    or
                                </Divider>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconButton
                                        href='/'
                                        component={Link}
                                        sx={{ color: '#497ce2' }}
                                        onClick={e => e.preventDefault()}
                                    >
                                        <Icon icon='mdi:facebook' />
                                    </IconButton>
                                    <IconButton
                                        href='/'
                                        component={Link}
                                        sx={{ color: '#1da1f2' }}
                                        onClick={e => e.preventDefault()}
                                    >
                                        <Icon icon='mdi:twitter' />
                                    </IconButton>
                                    <IconButton
                                        href='/'
                                        component={Link}
                                        onClick={e => e.preventDefault()}
                                        sx={{
                                            color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300')
                                        }}
                                    >
                                        <Icon icon='mdi:github' />
                                    </IconButton>
                                    <IconButton
                                        href='/'
                                        component={Link}
                                        sx={{ color: '#db4437' }}
                                        onClick={e => e.preventDefault()}
                                    >
                                        <Icon icon='mdi:google' />
                                    </IconButton>
                                </Box>
                            </form>
                        </BoxWrapper>
                    </Box>
                </RightWrapper>
            </Box>

            {/* Modal de seleção de unidade pra logar */}
            {openModalSelectUnits && (
                <DialogSelectUnit
                    openModal={openModalSelectUnits}
                    handleClose={handleCloseModalSelectUnits}
                    handleSubmit={handleConfirmUnit}
                    unidades={unitsUser}
                    setSelectedUnit={setSelectedUnit}
                />
            )}
        </>
    )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage

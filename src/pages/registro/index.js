// ** MUI Components
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Components Imports
import RegisterMultiStepsWizard from 'src/views/pages/auth/register-multi-steps'

// ** Styled Components
const RegisterMultiStepsIllustration = styled('img')({
  maxWidth: 200,
  height: 'auto',
  maxHeight: '100%'
})

const LeftWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12),
  [theme.breakpoints.up('lg')]: {
    maxWidth: 480
  },
  [theme.breakpoints.down(1285)]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 635
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(12)
  }
}))

const WizardWrapper = styled(Box)(({ theme }) => ({
  maxWidth: 700,
  margin: theme.spacing(0, 'auto'),
  [theme.breakpoints.up('md')]: {
    width: 700
  }
}))

const Registro = () => {
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))

  // ** Var
  const { skin } = settings

  return (
    <Box className='content-right'>
      {!hidden ? (
        <LeftWrapper>
          <img src='/images/storyset/fornecedorRegistro.svg' width={520} />
        </LeftWrapper>
      ) : null}
      <img
        alt='mask'
        src='https://demos.pixinvent.com/materialize-nextjs-admin-template/demo-3/images/pages/misc-mask-light.png'
        className='css-84vgca'
        style={{
          position: 'absolute',
          zIndex: '-1',
          bottom: '0',
          left: '0',
          width: '100%'
        }}
      />
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <WizardWrapper>
          <RegisterMultiStepsWizard />
        </WizardWrapper>
      </RightWrapper>
    </Box>
  )
}
Registro.getLayout = page => <BlankLayout>{page}</BlankLayout>
Registro.guestGuard = true

export default Registro

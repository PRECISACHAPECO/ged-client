// ** React Imports
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'src/configs/api'


// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import Payment from 'payment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomRadioIcons from 'src/@core/components/custom-radio/icons'

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

const data = [
  {
    value: 'basic',
    title: <Typography variant='h5'>Basic</Typography>,
    content: (
      <Box sx={{ my: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
          A simple start for start ups & Students
        </Typography>
        <Box sx={{ mt: 2, display: 'flex' }}>
          <Typography component='sup' sx={{ mt: 1.5, color: 'primary.main', alignSelf: 'flex-start' }}>
            $
          </Typography>
          <Typography component='span' sx={{ fontSize: '2rem', color: 'primary.main' }}>
            0
          </Typography>
          <Typography component='sub' sx={{ mb: 1.5, alignSelf: 'flex-end', color: 'text.disabled' }}>
            /month
          </Typography>
        </Box>
      </Box>
    )
  },
  {
    isSelected: true,
    value: 'standard',
    title: <Typography variant='h5'>Standard</Typography>,
    content: (
      <Box sx={{ my: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>For small to medium businesses</Typography>
        <Box sx={{ mt: 2, display: 'flex' }}>
          <Typography component='sup' sx={{ mt: 1.5, color: 'primary.main', alignSelf: 'flex-start' }}>
            $
          </Typography>
          <Typography component='span' sx={{ fontSize: '2rem', fontWeight: 500, color: 'primary.main' }}>
            99
          </Typography>
          <Typography component='sub' sx={{ mb: 1.5, alignSelf: 'flex-end', color: 'text.disabled' }}>
            /month
          </Typography>
        </Box>
      </Box>
    )
  },
  {
    value: 'enterprise',
    title: <Typography variant='h5'>Enterprise</Typography>,
    content: (
      <Box sx={{ my: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Solution for enterprise & organizations
        </Typography>
        <Box sx={{ mt: 2, display: 'flex' }}>
          <Typography component='sup' sx={{ mt: 1.5, color: 'primary.main', alignSelf: 'flex-start' }}>
            $
          </Typography>
          <Typography component='span' sx={{ fontSize: '2rem', color: 'primary.main' }}>
            499
          </Typography>
          <Typography component='sub' sx={{ mb: 1.5, alignSelf: 'flex-end', color: 'text.disabled' }}>
            /month
          </Typography>
        </Box>
      </Box>
    )
  }
]

const StepBillingDetails = ({ handlePrev, setDataGlobal, dataGlobal }) => {
  const initialSelected = data.filter(item => item.isSelected)[data.filter(item => item.isSelected).length - 1].value

  console.log(dataGlobal)

  const schema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório'),
    cpf: yup.string().required('CPF é obrigatório')
  })


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = value => {
    setDataGlobal({
      ...dataGlobal,
      usuario: value
    })
    handleNext()
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: 4 }}>
          <Typography variant='h5'>Verifique as informações</Typography>
          <Typography sx={{ color: 'text.secondary' }}>Envie se estiver tudo certo</Typography>
        </Box>

        <Grid container spacing={5}>
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
              <Button type='submit' onClick={handleSubmit} color='success' variant='contained' onClick={() => alert('Submitted..!!')}>
                Enviar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default StepBillingDetails

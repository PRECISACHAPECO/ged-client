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

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'src/configs/api'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const StepPersonalDetails = ({ handleNext, handlePrev, setDataGlobal, dataGlobal }) => {

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

    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h5'>Informações do usuário</Typography>
        <Typography sx={{ color: 'text.secondary' }}>Insira os detalhes do usuário</Typography>
      </Box>

      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <TextField
            label='Nome'
            fullWidth
            {...register('nome', { required: true })}
            error={errors.nome && true}
            helperText={errors.nome && errors.nome.message}

          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label='CPF'
            fullWidth
            {...register('cpf', { required: true })}
            error={errors.cpf && true}
            helperText={errors.cpf && errors.cpf.message}

          />
        </Grid>


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

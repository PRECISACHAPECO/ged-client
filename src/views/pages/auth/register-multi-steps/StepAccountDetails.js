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

const StepAccountDetails = ({ handleNext, setDataGlobal }) => {
    const router = Router
    const rota = router.pathname

    // false = não existe no banco / True = existe no banco
    const [validationCnpj, setValidationCnpj] = useState()
    const [data, setData] = useState()

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
                is: (val) => !validationCnpj,
                then: yup.string().required('Nome Fantasia é obrigatório')
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
                    setData(response.data)
                    setValidationCnpj(true)
                } else {
                    console.log("não cadastrado")
                    setValidationCnpj(false)
                }
            })
        }
    }

    // console.log(data)

    const onSubmit = value => {
        if (validationCnpj) {
            setDataGlobal({
                unidade: data
            })
        } else {
            setDataGlobal({
                unidade: value
            })
        }
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
                        validationCnpj === false && (
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label='Nome Fantasia'
                                    {...register('nomeFantasia', { required: true })}
                                    error={errors.nomeFantasia && true}
                                    helperText={errors.nomeFantasia && errors.nomeFantasia.message}
                                />
                            </Grid>
                        )
                    }

                    {
                        validationCnpj === true && (
                            <Grid item xs={12} md={12}>
                                <h1>CNPJ já cadastrado</h1>
                                <Typography sx={{ color: 'text.secondary' }}>{data.responsavel
                                }</Typography>

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

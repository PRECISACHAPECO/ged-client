import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Card, CardContent, FormControl, Grid, TextField } from '@mui/material'
import Router from 'next/router'
import { backRoute } from 'src/configs/defaultConfigs'
import { api } from 'src/configs/api'
import FormHeader from 'src/components/FormHeader'

const FormFornecedor = () => {
    const [fields, setFields] = useState([])
    const router = Router
    const staticUrl = backRoute(router.pathname) // Url sem ID

    useEffect(() => {
        // setTitle('Formulário do Fornecedor')
        const getData = () => {
            api.get(`${staticUrl}/fornecedor`).then(response => {
                console.log('res: ', response.data)
                setFields(response.data)
            })
        }
        getData()
    }, [])

    const validationSchema = yup.object().shape(
        fields.reduce((schema, field) => {
            if (field.obrigatorio == '1') {
                // console.log('OBRIGATORIO')
                schema[field.nomeColuna] = yup.string().required(`${field.nomeCampo} é obrigatório`)
            } else {
                schema[field.nomeColuna] = yup.string()
            }

            return schema
        }, {})
    )

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema)
    })

    const onSubmit = data => {
        console.log(data)
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormHeader
                    btnCancel
                    btnSave
                    handleSubmit={() => handleSubmit(onSubmit)}
                />
                <CardContent>
                    <Grid container spacing={5}>
                        {fields.map((field, index) => (
                            <Grid key={index} item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <Controller
                                        name={field.nomeColuna}
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value ?? ''}
                                                label={field.nomeCampo}
                                                onChange={onChange}
                                                placeholder={field.nomeCampo}
                                                aria-describedby='validation-schema-nome'
                                                error={!!errors[field.nomeColuna]}
                                                helperText={errors[field.nomeColuna]?.message}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </form>
        </Card>
    )
}

export default FormFornecedor

import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Card, CardContent, FormControl, Grid, TextField } from '@mui/material'
import Router from 'next/router'
import { backRoute } from 'src/configs/defaultConfigs'
import { api } from 'src/configs/api'
import FormHeader from 'src/components/FormHeader'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import { Loading } from 'src/components/Loading'
import { toastMessage } from 'src/configs/defaultConfigs'
import toast from 'react-hot-toast'

const FormFornecedor = () => {
    const { user } = useContext(AuthContext)
    const { setTitle } = useContext(ParametersContext)
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState([])
    const [data, setData] = useState(null)
    const router = Router
    const { id } = router.query
    const staticUrl = backRoute(router.pathname) // Url sem ID

    useEffect(() => {
        setTitle('Formulário do Fornecedor')

        const getData = () => {
            api.get(`${staticUrl}/${user.unidadeID}`, { headers: { 'function-name': 'getData' } }).then(response => {
                console.log('result: ', response.data)
                setFields(response.data.fields)
                setData(response.data.data)
            })
        }
        getData()
    }, [])

    // criar validação DINAMICA com reduce no Yup, varrendo campos fields e validando os valores vindos em defaultValues

    const defaultValues =
        data &&
        fields.reduce((defaultValues, field) => {
            defaultValues[field.nomeColuna] = data[field.nomeColuna]
            return defaultValues
        }, {})

    const {
        control,
        handleSubmit,
        formState: { errors },
        mode
    } = useForm({
        defaultValues,
        mode: 'onBlur'
    })

    console.log('errors: ', errors)

    const onSubmit = async data => {
        console.log('onSubmit: ', data)
        setLoading(true)
        try {
            await api.put(`${staticUrl}/${id}`, data).then(response => {
                toast.success(toastMessage.successUpdate)
                setLoading(false)
            })
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <>
            {loading && <Loading />}
            <Card>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormHeader btnCancel btnSave handleSubmit={() => handleSubmit(onSubmit)} />
                    <CardContent>
                        <Grid container spacing={5}>
                            {fields &&
                                fields.map((field, index) => (
                                    <Grid key={index} item xs={12} md={3}>
                                        <FormControl fullWidth>
                                            <Controller
                                                name={field.nomeColuna}
                                                control={control}
                                                rules={{ required: field.obrigatorio == 1 ? true : false }}
                                                render={({ field: { value, onChange } }) => (
                                                    <TextField
                                                        value={defaultValues[field.nomeColuna] ?? ''}
                                                        label={field.nomeCampo}
                                                        onChange={onChange}
                                                        placeholder={field.nomeCampo}
                                                        aria-describedby='validation-schema-nome'
                                                        error={!!errors[field.nomeColuna]}
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
        </>
    )
}

export default FormFornecedor

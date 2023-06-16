import { FormControl, Grid } from '@mui/material'
import { useEffect, useState, useContext } from 'react'
import { dateConfig } from 'src/configs/defaultConfigs'
import { AuthContext } from 'src/context/AuthContext'
import { backRoute } from 'src/configs/defaultConfigs'
import Router from 'next/router'

//* Custom inputs
import Input from 'src/components/Form/Input'
import Select from 'src/components/Form/Select'
import DateField from 'src/components/Form/DateField'

const Fields = ({ register, errors, setValue, fields, values, isDisabled, setCopiedDataContext }) => {
    const [dateStatus, setDateStatus] = useState({})
    const [watchRegistroEstabelecimento, setWatchRegistroEstabelecimento] = useState(null)
    const { loggedUnity, user } = useContext(AuthContext)
    const router = Router
    const staticUrl = backRoute(router.pathname)

    const itializeValues = () => {
        //? Inicializa os valores do formulário
        fields.map((field, index) => {
            if (field.tipo == 'int') {
                setValue(`header.${field.tabela}`, values?.[field.tabela] ? values?.[field.tabela] : null)
            } else {
                if (field.tipo == 'date') {
                    setDateFormat('dataPassado', field.nomeColuna, values[field.nomeColuna], 365)
                } else {
                    if (staticUrl == '/formularios/fornecedor' && user.papelID == 2) {
                        const result =
                            values?.[field.nomeColuna] === null && loggedUnity?.[field.nomeColuna]
                                ? (setCopiedDataContext(true), loggedUnity?.[field.nomeColuna])
                                : values?.[field.nomeColuna]
                        setValue(`header.${field.nomeColuna}`, result)
                    } else {
                        setValue(`header.${field.nomeColuna}`, values?.[field.nomeColuna])
                    }

                    console.log('nome da coluna', field.nomeColuna)
                    console.log('valor do campo', values?.[field.nomeColuna])
                }
            }
        })
        setWatchRegistroEstabelecimento(values?.registroestabelecimento ? values?.registroestabelecimento?.id : null)
    }

    const setDateFormat = (type, name, value, numDays) => {
        const newDate = new Date(value)
        const status = dateConfig(type, newDate, numDays)
        console.log('status', status)
        setDateStatus(prevState => ({
            ...prevState,
            [name]: status
        }))
    }

    useEffect(() => {
        itializeValues()
    }, [])

    return (
        <Grid container spacing={4}>
            {fields &&
                fields.map((field, index) => (
                    <>
                        <Grid key={index} item xs={12} md={3}>
                            <FormControl fullWidth>
                                {/* Autocomplete (int) */}
                                {field && field.tipo === 'int' && field.tabela && (
                                    <Select
                                        title={field.nomeCampo}
                                        options={field.options}
                                        name={`header.${field.tabela}`}
                                        value={values?.[field.tabela]}
                                        type={field.tabela}
                                        isDisabled={isDisabled}
                                        register={register}
                                        setValue={setValue}
                                        errors={errors?.header?.[field.tabela]}
                                        handleRegistroEstabelecimento={setWatchRegistroEstabelecimento}
                                    />
                                )}

                                {/* Date */}
                                {field && field.tipo == 'date' && (
                                    <DateField
                                        title='Data da avaliação'
                                        isDisabled={isDisabled}
                                        value={values?.[field.nomeColuna]}
                                        type={field.nomeColuna}
                                        name={`header.${field.nomeColuna}`}
                                        isRequired={field.obrigatorio ? true : false}
                                        errors={errors?.header?.[field.nomeColuna]}
                                        setDateFormat={setDateFormat}
                                        typeValidation='dataPassado'
                                        daysValidation={365}
                                        dateStatus={dateStatus}
                                        register={register}
                                    />
                                )}

                                {/* Textfield */}
                                {field &&
                                    field.tipo == 'string' &&
                                    (field.nomeColuna != 'numeroRegistro' || watchRegistroEstabelecimento > 1) && (
                                        <Input
                                            title={field.nomeCampo}
                                            name={`header.${field.nomeColuna}`}
                                            value={values?.[field.nomeColuna]}
                                            type={field.nomeColuna}
                                            isDisabled={isDisabled}
                                            register={register}
                                            errors={errors?.header?.[field.nomeColuna]}
                                        />
                                    )}
                            </FormControl>
                        </Grid>
                    </>
                ))}
        </Grid>
    )
}

export default Fields

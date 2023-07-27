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

const Fields = ({ register, errors, setValue, fields, values, disabled, control, setCopiedDataContext }) => {
    const [dateStatus, setDateStatus] = useState({})
    const [watchRegistroEstabelecimento, setWatchRegistroEstabelecimento] = useState(null)
    const { loggedUnity, user } = useContext(AuthContext)
    const router = Router
    const staticUrl = backRoute(router.pathname)

    const itializeValues = () => {
        //? Inicializa os valores do formulário
        fields?.map((field, index) => {
            if (field.tipo == 'int') {
                setValue(`header.${field.tabela}`, values?.[field.tabela] ? values?.[field.tabela] : null)
            } else {
                if (field.tipo == 'date') {
                    setDateFormat('dataPassado', field.nomeColuna, values?.[field.nomeColuna], 365)
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
                }
            }
        })
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

    const setRegistroEstabelecimento = () => {
        fields &&
            fields.map((field, index) => {
                if (field?.nomeColuna == 'registroEstabelecimentoID') {
                    setWatchRegistroEstabelecimento(field?.[field.tabela]?.id > 0 ? field?.[field.tabela].id : null)
                }
            })
    }

    useEffect(() => {
        setRegistroEstabelecimento()
    }, [])

    return (
        <Grid container spacing={4}>
            {fields &&
                fields.map((field, index) => (
                    <>
                        {/* Autocomplete (int) */}
                        {field && field.tipo === 'int' && field.tabela && (
                            <Select
                                xs={12}
                                md={3}
                                title={field.nomeCampo}
                                name={`fields[${index}].${field.tabela}`}
                                type={field.tabela}
                                options={field.options}
                                value={field?.[field.tabela]}
                                mask={field.tabela}
                                disabled={disabled}
                                register={register}
                                control={control}
                                setValue={setValue}
                                errors={errors?.header?.[field.tabela]}
                                handleRegistroEstabelecimento={setWatchRegistroEstabelecimento}
                            />
                        )}

                        {/* Date */}
                        {field && field.tipo == 'date' && (
                            <DateField
                                xs={12}
                                md={3}
                                title='Data da avaliação'
                                disabled={disabled}
                                value={field?.[field.nomeColuna]}
                                type={field.nomeColuna}
                                name={`fields[${index}].${field.nomeColuna}`}
                                errors={errors?.header?.[field.nomeColuna]}
                                control={control}
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
                                    xs={12}
                                    md={3}
                                    title={field.nomeCampo}
                                    name={`fields[${index}].${field.nomeColuna}`}
                                    value={field?.[field.nomeColuna]}
                                    type={field.nomeColuna}
                                    disabled={disabled}
                                    register={register}
                                    errors={errors?.header?.[field.nomeColuna]}
                                />
                            )}
                    </>
                ))}
        </Grid>
    )
}

export default Fields

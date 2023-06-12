import { Autocomplete, CardContent, FormControl, Grid, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { dateConfig } from 'src/configs/defaultConfigs'
import { cnpjMask, cellPhoneMask, cepMask, ufMask } from 'src/configs/masks'

const Fields = ({ register, errors, setValue, fields, values }) => {
    const [dateStatus, setDateStatus] = useState({})
    const [watchRegistroEstabelecimento, setWatchRegistroEstabelecimento] = useState(null)

    const itializeValues = () => {
        //? Inicializa os valores do formulário
        fields.map((field, index) => {
            if (field.tipo == 'int') {
                setValue(`header.${field.tabela}`, values?.[field.tabela] ? values?.[field.tabela] : null)
            } else {
                if (field.tipo == 'date' && field.nomeColuna == 'dataAvaliacao') {
                    setDateFormat('dataPassado', field.nomeColuna, values[field.nomeColuna], 365)
                } else {
                    setValue(`header.${field.nomeColuna}`, values?.[field.nomeColuna])
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
                                    <Autocomplete
                                        options={field.options}
                                        getOptionSelected={(option, value) => option.id === value.id}
                                        defaultValue={values?.[field.tabela]?.id ? values?.[field.tabela] : null}
                                        getOptionLabel={option => option.nome}
                                        name={`header.${field.tabela}`}
                                        {...register(`header.${field.tabela}`)}
                                        onChange={(event, newValue) => {
                                            setValue(`header.${field.tabela}`, newValue ? newValue : null)
                                            field.tabela == 'registroestabelecimento'
                                                ? setWatchRegistroEstabelecimento(newValue ? newValue.id : null)
                                                : null
                                        }}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label={field.nomeCampo}
                                                placeholder={field.nomeCampo}
                                                error={errors?.header?.[field.tabela] ? true : false}
                                            />
                                        )}
                                    />
                                )}

                                {/* Date */}
                                {field && field.tipo == 'date' && (
                                    <>
                                        <TextField
                                            type='date'
                                            label='Data da Avaliação'
                                            // disabled={!canEdit.status}
                                            defaultValue={
                                                values?.[field.nomeColuna]
                                                    ? new Date(values?.[field.nomeColuna]).toISOString().split('T')[0]
                                                    : ''
                                            }
                                            name={`header.${field.nomeColuna}`}
                                            aria-describedby='validation-schema-nome'
                                            error={
                                                errors?.header?.[field.nomeColuna]
                                                    ? true
                                                    : !dateStatus[field.nomeColuna]?.status
                                                    ? true
                                                    : false
                                            }
                                            {...register(`header.${field.nomeColuna}`, {
                                                required: field.obrigatorio && canEdit.status
                                            })}
                                            onChange={e => {
                                                setDateFormat('dataPassado', field.nomeColuna, e.target.value, 365)
                                                console.log('data onchange', dateStatus)
                                            }}
                                            variant='outlined'
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            inputProps={{
                                                min: dateStatus[field.nomeColuna]?.dataIni,
                                                max: dateStatus[field.nomeColuna]?.dataFim
                                            }}
                                        />
                                        {!dateStatus?.status && field && field.tipo == 'date' && (
                                            <Typography component='span' variant='caption' color='error'>
                                                {dateStatus?.[field.nomeColuna]?.message}
                                            </Typography>
                                        )}
                                    </>
                                )}

                                {/* Textfield */}
                                {field &&
                                    field.tipo == 'string' &&
                                    (field.nomeColuna != 'numeroRegistro' || watchRegistroEstabelecimento > 1) && (
                                        <TextField
                                            defaultValue={values?.[field.nomeColuna] ?? ''}
                                            label={field.nomeCampo}
                                            placeholder={field.nomeCampo}
                                            name={`header.${field.nomeColuna}`}
                                            aria-describedby='validation-schema-nome'
                                            error={errors?.header?.[field.nomeColuna] ? true : false}
                                            {...register(`header.${field.nomeColuna}`)}
                                            // Validações
                                            onChange={e => {
                                                field.nomeColuna == 'cnpj'
                                                    ? (e.target.value = cnpjMask(e.target.value))
                                                    : field.nomeColuna == 'cep'
                                                    ? ((e.target.value = cepMask(e.target.value)),
                                                      getAddressByCep(e.target.value))
                                                    : field.nomeColuna == 'telefone'
                                                    ? (e.target.value = cellPhoneMask(e.target.value))
                                                    : field.nomeColuna == 'estado'
                                                    ? (e.target.value = ufMask(e.target.value))
                                                    : (e.target.value = e.target.value)
                                            }}
                                            // inputProps com maxLength 18 se field.nomeColuna == 'cnpj
                                            inputProps={
                                                // inputProps validando maxLength pra cnpj, cep e telefone baseado no field.nomeColuna
                                                field.nomeColuna == 'cnpj'
                                                    ? { maxLength: 18 }
                                                    : field.nomeColuna == 'cep'
                                                    ? { maxLength: 9 }
                                                    : field.nomeColuna == 'telefone'
                                                    ? { maxLength: 15 }
                                                    : field.nomeColuna == 'estado'
                                                    ? { maxLength: 2 }
                                                    : {}
                                            }
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

import { Autocomplete, CardContent, FormControl, Grid, TextField } from '@mui/material'
import { useState } from 'react'
// Date
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br' // import locale

import { cnpjMask, cellPhoneMask, cepMask, ufMask } from 'src/configs/masks'
import { useForm } from 'react-hook-form'

const Fields = ({ fields, values }) => {
    const {
        trigger,
        reset,
        register,
        getValues,
        setValue,
        handleSubmit,
        clearErrors,
        setError,
        formState: { errors }
    } = useForm()

    return (
        <Grid container spacing={4}>
            {fields &&
                fields.map((field, index) => (
                    <>
                        <Grid key={index} item xs={12} md={3}>
                            <FormControl fullWidth>
                                {/* int (select) */}
                                {field && field.tipo === 'int' && field.tabela && (
                                    <Autocomplete
                                        options={field.options}
                                        getOptionSelected={(option, value) => option.id === value.id}
                                        defaultValue={values?.[field.tabela]?.id ? values?.[field.tabela] : null}
                                        getOptionLabel={option => option.nome}
                                        name={`header.${field.tabela}`}
                                        {...register(`header.${field.tabela}`)}
                                        onChange={(event, newValue) => {
                                            console.log('🚀 ~ newValue:', newValue)
                                            setValue(`header.${field.tabela}`, newValue ? newValue : null)
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
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label='Selecione uma data'
                                            locale={dayjs.locale('pt-br')}
                                            format='DD/MM/YYYY'
                                            defaultValue={dayjs(new Date())}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    variant='outlined'
                                                    name={`header.${field.nomeColuna}`}
                                                    {...register(`header.${field.nomeColuna}`)}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                )}

                                {/* Textfield */}
                                {field && field.tipo == 'string' && (
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
                                            // setValue(`header.${field.nomeColuna}`, '')

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

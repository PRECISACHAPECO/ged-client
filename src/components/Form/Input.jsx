import { useRef } from 'react'
import { FormControl, Grid, TextField } from '@mui/material'
import { cnpjMask, cellPhoneMask, cepMask, ufMask, cpfMask, rgMask } from 'src/configs/masks'

const Input = ({
    xs,
    md,
    title,
    name,
    rows,
    value,
    type,
    mask,
    getAddressByCep,
    multiline,
    disabled,
    required,
    register,
    errors
}) => {
    const inputRef = useRef(null)

    return (
        <Grid item xs={xs} md={md} sx={{ my: 1 }}>
            <FormControl fullWidth>
                <TextField
                    multiline={multiline}
                    defaultValue={value ?? ''}
                    label={title}
                    rows={rows}
                    type={type ?? 'text'}
                    placeholder={title}
                    name={name}
                    disabled={disabled}
                    aria-describedby='validation-schema-nome'
                    error={errors}
                    {...register(name, { required })}
                    inputRef={inputRef}
                    // Validações
                    onChange={e => {
                        mask === 'cnpj'
                            ? (e.target.value = cnpjMask(e.target.value))
                            : mask === 'cep'
                            ? ((e.target.value = cepMask(e.target.value)), getAddressByCep(e.target.value))
                            : mask === 'telefone'
                            ? (e.target.value = cellPhoneMask(e.target.value))
                            : mask === 'estado'
                            ? (e.target.value = ufMask(e.target.value))
                            : mask === 'cpf'
                            ? (e.target.value = cpfMask(e.target.value))
                            : mask === 'rg'
                            ? (e.target.value = rgMask(e.target.value))
                            : (e.target.value = e.target.value)
                    }}
                    inputProps={
                        mask === 'cnpj'
                            ? {
                                  maxLength: 18,
                                  type: 'tel', // define o tipo de entrada como 'tel'
                                  inputMode: 'numeric'
                              }
                            : mask === 'cep'
                            ? {
                                  maxLength: 9,
                                  type: 'tel', // define o tipo de entrada como 'tel'
                                  inputMode: 'numeric'
                              }
                            : mask === 'telefone'
                            ? {
                                  maxLength: 14
                              }
                            : mask === 'cpf'
                            ? {
                                  maxLength: 14
                              }
                            : mask === 'rg'
                            ? {
                                  maxLength: 11
                              }
                            : mask === 'estado'
                            ? { maxLength: 2 }
                            : {}
                    }
                />
            </FormControl>
        </Grid>
    )
}

export default Input

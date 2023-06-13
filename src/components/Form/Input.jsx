import { Autocomplete, FormControl, Grid, TextField, Box, Tooltip, IconButton } from '@mui/material'
import { cnpjMask, cellPhoneMask, cepMask, ufMask } from 'src/configs/masks'

const Input = ({ title, name, value, type, multiline, isDisabled, isRequired, register, errors }) => {
    return (
        <TextField
            multiline={multiline}
            defaultValue={value ?? ''}
            label={title}
            placeholder={title}
            name={name}
            disabled={isDisabled ? true : false}
            aria-describedby='validation-schema-nome'
            error={errors ? true : false}
            {...register(name, { required: isRequired ? true : false })}
            // Validações
            onChange={e => {
                type === 'cnpj'
                    ? (e.target.value = cnpjMask(e.target.value))
                    : type === 'cep'
                    ? ((e.target.value = cepMask(e.target.value)), getAddressByCep(e.target.value))
                    : type === 'telefone'
                    ? (e.target.value = cellPhoneMask(e.target.value))
                    : type === 'estado'
                    ? (e.target.value = ufMask(e.target.value))
                    : (e.target.value = e.target.value)
            }}
            inputProps={
                type === 'cnpj'
                    ? { maxLength: 18 }
                    : type === 'cep'
                    ? { maxLength: 9 }
                    : type === 'telefone'
                    ? { maxLength: 15 }
                    : type === 'estado'
                    ? { maxLength: 2 }
                    : {}
            }
        />
    )
}

export default Input

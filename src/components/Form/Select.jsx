import { Autocomplete, TextField } from '@mui/material'

const Select = ({
    title,
    options,
    name,
    type,
    idName,
    value,
    isRequired,
    isDisabled,
    register,
    setValue,
    errors,
    handleRegistroEstabelecimento
}) => {
    return (
        <Autocomplete
            options={options}
            getOptionLabel={option => option.nome}
            defaultValue={value ?? { nome: '' }}
            disabled={isDisabled ? true : false}
            name={name}
            {...register(name, { required: isRequired ? true : false })}
            onChange={(e, tmpValue) => {
                const newValue = tmpValue ? { id: tmpValue[idName ?? 'id'], nome: tmpValue.nome } : null
                setValue(name, newValue)
                type == 'registroestabelecimento' ? handleRegistroEstabelecimento(newValue ? newValue.id : null) : null
            }}
            renderInput={params => (
                <TextField {...params} label={title} placeholder={title} error={errors ? true : false} />
            )}
        />
    )
}

export default Select

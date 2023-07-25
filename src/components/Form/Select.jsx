// import { Grid, FormControl, Autocomplete, TextField } from '@mui/material'
// import { useEffect, useState } from 'react'

// const Select = ({
//     xs,
//     md,
//     title,

//     options,
//     block,

//     optionsSelected,
//     indexFather,

//     name,
//     type,
//     limitTags,
//     value,
//     required,
//     control,

//     disabled,
//     register,
//     multiple,
//     setValue,
//     errors,
//     handleRegistroEstabelecimento
// }) => {
//     console.log('Select => value: ', value)
//     return (
//         <Grid item xs={xs} md={md} sx={{ my: 1 }}>
//             <FormControl fullWidth>
//                 <Autocomplete
//                     multiple={multiple}
//                     limitTags={limitTags}
//                     options={options}
//                     getOptionLabel={option => option.nome}
//                     defaultValue={
//                         multiple
//                             ? value.map(item => options.find(option => option.nome === item.nome))
//                             : value ?? { nome: '' }
//                     }
//                     disabled={disabled}
//                     {...register(name, { required })}
//                     onChange={(e, newValue) => {
//                         console.log('🚀 Select => onChange:', newValue)
//                         setValue(name, newValue)
//                         type == 'registroestabelecimento'
//                             ? handleRegistroEstabelecimento(newValue ? newValue.id : null)
//                             : null
//                     }}
//                     renderInput={params => <TextField {...params} label={title} placeholder={title} error={errors} />}
//                 />
//             </FormControl>
//         </Grid>
//     )
// }

// export default Select

import { Grid, FormControl, Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'

const Select = ({
    xs,
    md,
    title,
    options,
    block,
    optionsSelected,
    indexFather,
    name,
    type,
    limitTags,
    value,
    required,
    control, // Add 'control' prop to receive the react-hook-form control object
    disabled,
    register,
    multiple,
    setValue,
    errors,
    handleRegistroEstabelecimento
}) => {
    return (
        <Grid item xs={xs} md={md} sx={{ my: 1 }}>
            <FormControl fullWidth>
                {/* Use the Controller component here */}
                <Controller
                    name={name}
                    control={control}
                    defaultValue={
                        multiple && value
                            ? value.map(item => options.find(option => option.nome === item.nome))
                            : value ?? { nome: '' }
                    }
                    rules={{ required }} // Pass the validation rules
                    render={({ field }) => (
                        <Autocomplete
                            multiple={multiple}
                            limitTags={limitTags}
                            options={options}
                            getOptionLabel={option => option.nome}
                            value={field.value}
                            disabled={disabled}
                            onChange={(e, newValue) => {
                                console.log('🚀 Select:', newValue)
                                field.onChange(newValue)

                                type === 'registroestabelecimento'
                                    ? handleRegistroEstabelecimento(newValue ? newValue.id : null)
                                    : null
                            }}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={title}
                                    placeholder={title}
                                    // error={errors[name] ? true : false} // Use the error from react-hook-form
                                />
                            )}
                        />
                    )}
                />
            </FormControl>
        </Grid>
    )
}

export default Select

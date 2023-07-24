import { Grid, FormControl, TextField, Typography } from '@mui/material'
import { Controller } from 'react-hook-form'

const DateField = ({
    xs,
    md,
    title,
    isRequired,
    disabled,
    type,
    value,
    name,
    setDateFormat,
    typeValidation,
    daysValidation,
    dateStatus,
    errors,
    control // Add 'control' prop to receive the react-hook-form control object
}) => {
    const formatDate = dateString => {
        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${year}-${month}-${day}`
    }

    return (
        <Grid item xs={xs} md={md}>
            <FormControl fullWidth>
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            type='date'
                            label={title}
                            disabled={disabled ? true : false}
                            defaultValue={value ? formatDate(value) : ''}
                            onChange={e => {
                                field.onChange(e) // Manually update the field value
                                setDateFormat(typeValidation, type, e.target.value, daysValidation)
                            }}
                            variant='outlined'
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                min: dateStatus[type]?.dataIni,
                                max: dateStatus[type]?.dataFim
                            }}
                        />
                    )}
                />
            </FormControl>
        </Grid>
    )
}

export default DateField

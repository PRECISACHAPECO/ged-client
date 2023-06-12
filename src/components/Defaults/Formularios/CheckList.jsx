import { Checkbox, FormControlLabel, ListItem, ListItemButton, Typography } from '@mui/material'

const CheckList = ({ title, values, name, changeCategory, register, isDisabled }) => {
    return (
        <>
            <ListItem disablePadding>
                <ListItemButton>
                    <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                </ListItemButton>
            </ListItem>
            {values &&
                values.map((value, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton>
                            <input
                                type='hidden'
                                name={`${name}.[${index}].id`}
                                defaultValue={value.id}
                                {...register(`${name}.[${index}].id`)}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name={`${name}[${index}].checked`}
                                        disabled={isDisabled ? true : false}
                                        {...register(`${name}[${index}].checked`)}
                                        defaultChecked={value.checked == 1 ? true : false}
                                        onClick={event =>
                                            changeCategory
                                                ? changeCategory(value.id, event.target.checked ? true : false)
                                                : null
                                        }
                                    />
                                }
                                label={value.nome}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
        </>
    )
}

export default CheckList

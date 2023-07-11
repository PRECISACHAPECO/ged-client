import { Grid, Typography, Box, FormControlLabel, Checkbox, ListItem, ListItemButton } from '@mui/material'

const CheckLabel = ({ xs, md, title, index, name, typePage, value, register }) => {
    return (
        <Grid item xs={xs} md={md}>
            <Box display='flex' flexDirection='column' alignItems='start' sx={{ my: 2 }}>
                <FormControlLabel
                    control={<Checkbox name={name} {...register(name)} defaultChecked={value} />}
                    label={title}
                    sx={{
                        '&:hover': {
                            '& .MuiFormControlLabel-label': {
                                color: 'primary.main'
                            }
                        }
                    }}
                />
            </Box>
        </Grid>
    )
}

export default CheckLabel

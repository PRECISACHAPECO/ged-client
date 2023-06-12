import { Autocomplete, Card, CardContent, FormControl, Grid, TextField, Typography } from '@mui/material'
import Item from 'src/components/Defaults/Formularios/Item'

const Block = ({ index, values, blockKey, register, setValue, errors, isDisabled }) => {
    return (
        <>
            <Card key={index} sx={{ mt: 4 }}>
                <CardContent>
                    <Grid container>
                        <input
                            type='hidden'
                            name={`blocos[${index}].${blockKey}`}
                            defaultValue={values[blockKey]}
                            {...register(`blocos[${index}].${blockKey}`)}
                        />

                        <Grid item xs={12} md={12}>
                            <Typography color='primary' variant='subtitle1' sx={{ fontWeight: 700, mb: 6 }}>
                                {values.nome}
                            </Typography>
                        </Grid>

                        {/* Itens */}
                        {values.itens &&
                            values.itens.map((item, indexItem) => (
                                <Item
                                    key={indexItem}
                                    blockIndex={index}
                                    index={indexItem}
                                    values={item}
                                    register={register}
                                    setValue={setValue}
                                    errors={errors}
                                    isDisabled={isDisabled}
                                />
                            ))}
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}

export default Block

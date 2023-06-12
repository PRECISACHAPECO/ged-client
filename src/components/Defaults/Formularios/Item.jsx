import { Autocomplete, Card, CardContent, FormControl, Grid, TextField, Typography } from '@mui/material'

const Item = ({ blockIndex, index, values, register, errors, setValue }) => {
    return (
        <Grid index={index} container spacing={4} sx={{ mb: 4 }}>
            {/* Hidden do itemID */}
            <input
                type='hidden'
                name={`blocos[${blockIndex}].itens[${index}].itemID`}
                defaultValue={values.itemID}
                {...register(`blocos[${blockIndex}].itens[${index}].itemID`)}
            />

            {/* Descrição do item */}
            <Grid item xs={12} md={6}>
                {values.ordem + ' - ' + values.nome}
            </Grid>

            {/* Alternativas de respostas */}
            <Grid item xs={12} md={3}>
                {/* Tipo de alternativa  */}
                <input
                    type='hidden'
                    name={`blocos[${blockIndex}].itens[${index}].tipoAlternativa`}
                    defaultValue={values.alternativa}
                    {...register(`blocos[${blockIndex}].itens[${index}].tipoAlternativa`)}
                />

                <FormControl fullWidth>
                    {/* +1 opção pra selecionar (Select) */}
                    {values && values.alternativas && values.alternativas.length > 1 && (
                        <Autocomplete
                            options={values.alternativas}
                            getOptionLabel={option => option.nome}
                            defaultValue={values.resposta ? values.resposta : { nome: '' }}
                            name={`blocos[${blockIndex}].itens[${index}].resposta`}
                            {...register(`blocos[${blockIndex}].itens[${index}].resposta`)}
                            onChange={(event, newValue) => {
                                console.log('🚀 ~ newValue:', newValue)
                                setValue(
                                    `blocos[${blockIndex}].itens[${index}].resposta`,
                                    newValue
                                        ? {
                                              id: newValue.alternativaID,
                                              nome: newValue.nome
                                          }
                                        : null
                                )
                            }}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label='Selecione uma resposta'
                                    placeholder='Selecione uma resposta'
                                    // Se uma opções for selecionada, pintar a borda do autocomplete de verde
                                    error={errors?.blocos?.[blockIndex]?.itens[index]?.resposta ? true : false}
                                />
                            )}
                        />
                    )}

                    {/* Data */}
                    {/* {item.alternativas.length == 0 && item.alternativa == 'Data' && (
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <DatePicker
                                                                    label='Selecione uma data'
                                                                    locale={dayjs.locale('pt-br')}
                                                                    format='DD/MM/YYYY'
                                                                    defaultValue={
                                                                        item.resposta
                                                                            ? dayjs(new Date(item.resposta))
                                                                            : ''
                                                                    }
                                                                    onChange={newValue => {
                                                                        setValue(
                                                                            `blocos[${blockIndex}].itens[${index}].resposta`,
                                                                            newValue ? newValue : ''
                                                                        )
                                                                    }}
                                                                    renderInput={params => (
                                                                        <TextField
                                                                            {...params}
                                                                            variant='outlined'
                                                                            name={`blocos[${blockIndex}].itens[${index}].resposta`}
                                                                            {...register(
                                                                                `blocos[${blockIndex}].itens[${index}].resposta`
                                                                            )}
                                                                        />
                                                                    )}
                                                                />
                                                            </LocalizationProvider>
                                                        )} */}

                    {/* Dissertativa */}
                    {values.alternativas.length == 0 && values.alternativa == 'Dissertativa' && (
                        <TextField
                            multiline
                            label='Descreva a resposta'
                            placeholder='Descreva a resposta'
                            name={`blocos[${blockIndex}].itens[${index}].resposta`}
                            defaultValue={values.resposta ?? ''}
                            {...register(`blocos[${blockIndex}].itens[${index}].resposta`)}
                            error={errors?.blocos?.[blockIndex]?.itens[index]?.resposta ? true : false}
                        />
                    )}
                </FormControl>
            </Grid>

            {/* Obs */}
            {values && values.obs == 1 && (
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                        <TextField
                            label='Observação'
                            placeholder='Observação'
                            name={`blocos[${blockIndex}].itens[${index}].observacao`}
                            defaultValue={values.observacao ?? ''}
                            {...register(`blocos[${blockIndex}].itens[${index}].observacao`)}
                        />
                    </FormControl>
                </Grid>
            )}
        </Grid>
    )
}

export default Item

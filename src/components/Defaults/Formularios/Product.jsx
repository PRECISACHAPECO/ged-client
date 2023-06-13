import { Autocomplete, FormControl, Grid, TextField, Box, Tooltip, IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { cnpjMask, cellPhoneMask, cepMask, ufMask } from 'src/configs/masks'

const Product = ({ field, data, indexData, indexField, numFields, removeProduct, register, setValue, errors }) => {
    return (
        <Grid item xs={12} md={12 / numFields} key={indexField}>
            {/* Enviar hidden de recebimentompProdutoID */}
            <input
                type='hidden'
                name={`produtos[${indexData}].recebimentompProdutoID`}
                defaultValue={data?.recebimentompProdutoID}
                {...register(`produtos[${indexData}].recebimentompProdutoID`)}
            />

            {/* int (select) */}
            {field && field.tipo === 'int' && field.tabela && (
                <FormControl fullWidth>
                    <Autocomplete
                        key={indexData}
                        options={field.options}
                        value={data?.[field.tabela]}
                        getOptionLabel={option => option.nome}
                        name={`produtos[${indexData}].${field.tabela}`}
                        {...register(`produtos[${indexData}].${field.tabela}`)}
                        onChange={(event, newValue) => {
                            setValue(`produtos[${indexData}].${field.tabela}`, newValue ? newValue : null)
                        }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={field.nomeCampo}
                                placeholder={field.nomeCampo}
                                error={errors?.produtos?.[indexData]?.[field.tabela] ? true : false}
                            />
                        )}
                    />
                </FormControl>
            )}

            {/* Textfield */}
            {field && field.tipo === 'string' && (
                <Box display='flex'>
                    <Box flexBasis='80%'>
                        <FormControl fullWidth>
                            <TextField
                                defaultValue={data?.[field.nomeColuna]}
                                label={field.nomeCampo}
                                placeholder={field.nomeCampo}
                                name={`produtos[${indexData}].${field.nomeColuna}`}
                                aria-describedby='validation-schema-nome'
                                error={errors?.produtos?.[indexData]?.[field.nomeColuna] ? true : false}
                                {...register(`produtos[${indexData}].${field.nomeColuna}`)}
                                // Validações
                                onChange={e => {
                                    field.nomeColuna === 'cnpj'
                                        ? (e.target.value = cnpjMask(e.target.value))
                                        : field.nomeColuna === 'cep'
                                        ? ((e.target.value = cepMask(e.target.value)), getAddressByCep(e.target.value))
                                        : field.nomeColuna === 'telefone'
                                        ? (e.target.value = cellPhoneMask(e.target.value))
                                        : field.nomeColuna === 'estado'
                                        ? (e.target.value = ufMask(e.target.value))
                                        : (e.target.value = e.target.value)
                                }}
                                // inputProps com maxLength 18 se field.nomeColuna === 'cnpj'
                                inputProps={
                                    // inputProps validando maxLength para cnpj, cep e telefone baseado no field.nomeColuna
                                    field.nomeColuna === 'cnpj'
                                        ? { maxLength: 18 }
                                        : field.nomeColuna === 'cep'
                                        ? { maxLength: 9 }
                                        : field.nomeColuna === 'telefone'
                                        ? { maxLength: 15 }
                                        : field.nomeColuna === 'estado'
                                        ? { maxLength: 2 }
                                        : {}
                                }
                            />
                        </FormControl>
                    </Box>

                    {/* Botão Delete (insere botão na última coluna da linha) */}
                    {indexField == numFields - 1 && (
                        <Box flexBasis='20%' textAlign='center'>
                            <Tooltip
                                title={
                                    2 == 1
                                        ? `Este item não pode mais ser removido pois já foi respondido em um formulário`
                                        : `Remover este item`
                                }
                            >
                                <IconButton
                                    color='error'
                                    onClick={() => {
                                        2 === 1 ? null : removeProduct(data, indexData)
                                    }}
                                    sx={{
                                        marginTop: 2,
                                        opacity: 2 === 1 ? 0.5 : 1,
                                        cursor: 2 === 1 ? 'default' : 'pointer'
                                    }}
                                >
                                    <Icon icon='tabler:trash-filled' />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Box>
            )}
        </Grid>
    )
}

export default Product

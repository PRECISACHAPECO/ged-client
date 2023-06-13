import { Autocomplete, FormControl, Grid, TextField, Box, Tooltip, IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { cnpjMask, cellPhoneMask, cepMask, ufMask } from 'src/configs/masks'
import Input from 'src/components/Form/Input'

const Product = ({ field, data, indexData, isDisabled, register, setValue, errors }) => {
    console.log('product errors: ', errors)

    return (
        <>
            {/* Enviar hidden de recebimentompProdutoID */}
            <input
                type='hidden'
                name={`produtos[${indexData}].recebimentompProdutoID`}
                defaultValue={data?.recebimentompProdutoID}
                {...register(`produtos[${indexData}].recebimentompProdutoID`)}
            />

            {/* int (select) */}
            {field && field.tipo === 'int' && field.tabela && (
                <Autocomplete
                    key={indexData}
                    options={field.options}
                    value={data?.[field.tabela]}
                    getOptionLabel={option => option.nome}
                    name={`produtos[${indexData}].${field.tabela}`}
                    disabled={isDisabled ? true : false}
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
            )}

            {/* Input */}
            {field && field.tipo === 'string' && (
                <Input
                    title={field.nomeCampo}
                    name={`produtos[${indexData}].${field.nomeColuna}`}
                    value={data?.[field.nomeColuna]}
                    type={field.nomeColuna}
                    isDisabled={isDisabled}
                    register={register}
                    errors={errors?.produtos?.[indexData]?.[field.nomeColuna]}
                />
            )}
        </>
    )
}

export default Product

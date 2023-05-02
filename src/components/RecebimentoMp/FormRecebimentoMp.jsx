// import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    FormControlLabel,
    Grid,
    ListItem,
    ListItemButton,
    Radio,
    TextField,
    Typography
} from '@mui/material'
import Router from 'next/router'
import { backRoute } from 'src/configs/defaultConfigs'
import { generateReport } from 'src/configs/defaultConfigs'
import { api } from 'src/configs/api'
import FormHeader from 'src/components/Defaults/FormHeader'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import Loading from 'src/components/Loading'
import { toastMessage } from 'src/configs/defaultConfigs'
import toast from 'react-hot-toast'
import { Checkbox } from '@mui/material'
import { SettingsContext } from 'src/@core/context/settingsContext'
import { cnpjMask, cellPhoneMask, cepMask, ufMask } from 'src/configs/masks'

// Date
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br' // import locale

const FormRecebimentoMp = () => {
    const { user, loggedUnity } = useContext(AuthContext)
    const { setTitle } = useContext(ParametersContext)
    const [isLoading, setLoading] = useState(true)

    const [fields, setFields] = useState([])
    const [data, setData] = useState(null)
    const [fieldProducts, setFieldsProducts] = useState([])
    const [dataProducts, setDataProducts] = useState([])
    const [blocos, setBlocos] = useState([])
    const [info, setInfo] = useState('')

    const router = Router
    const { id } = router.query
    const staticUrl = backRoute(router.pathname) // Url sem ID

    const { settings } = useContext(SettingsContext)
    const mode = settings.mode

    const defaultValues =
        data &&
        fields.reduce((defaultValues, field) => {
            if (field.tabela) {
                // Select (objeto com id e nome)
                defaultValues[field.tabela] = {
                    id: data[field.tabela]?.id,
                    nome: data[field.tabela]?.nome
                }
            } else {
                // Input
                defaultValues[field.nomeColuna] = data[field.nomeColuna]
            }

            return defaultValues
        }, {})

    const {
        watch,
        register,
        control,
        setValue,
        handleSubmit,
        formState: { errors },
        trigger
    } = useForm({ defaultValues, mode: 'onBlur' })

    console.log('errors: ', errors)

    fields.map((field, index) => {
        setValue(`header.${field.tabela}`, defaultValues?.[field.tabela])
    })

    // Seta autocomplete com o valor do banco em um objeto com id e nome
    dataProducts.map((data, indexData) => {
        fieldProducts.map((field, indexFields) => {
            setValue(`produtos[${indexData}].${field.tabela}`, data?.[field.tabela])
        })
    })

    const onSubmit = async data => {
        console.log('onSubmit: ', data)
        try {
            await api.put(`${staticUrl}/${id}`, data).then(response => {
                toast.success(toastMessage.successUpdate)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleRadioChange = event => {
        const newValue = event.target.value

        const newInfo = {
            ...info,
            status: newValue
        }
        setInfo(newInfo)
    }

    const getAddressByCep = cepString => {
        if (cepString.length == 9) {
            const cep = cepString.replace(/[^0-9]/g, '')
            api.get(`https://viacep.com.br/ws/${cep}/json/`).then(response => {
                if (response.data.localidade) {
                    setValue('header.logradouro', response.data.logradouro)
                    setValue('header.bairro', response.data.bairro)
                    setValue('header.cidade', response.data.localidade)
                    setValue('header.estado', response.data.uf)
                    toast.success('Endereço encontrado!')
                } else {
                    toast.error('Endereço não encontrado!')
                }
            })
        }
    }

    const addProduct = () => {
        const newProduct = [...dataProducts]
        const newProductFields = fieldProducts.map((field, index) => {
            if (field.tabela) {
                // Select (objeto com id e nome)
                return {
                    [field.tabela]: {
                        id: '',
                        nome: ''
                    }
                }
            } else {
                return {
                    [field.nomeColuna]: ''
                }
            }
        })
        newProduct.push(newProductFields)
        setDataProducts(newProduct)
    }

    // Nomes e rotas dos relatórios passados para o componente FormHeader/MenuReports
    const dataReports = [
        {
            id: 1,
            name: 'recebimentoMP',
            identification: '01',
            route: 'relatorio/recebimentoMP',
            params: {
                recebimentompID: id,
                unidadeID: loggedUnity.unidadeID
            }
        },
        {
            id: 2,
            name: 'Recepção',
            identification: '02',
            route: '/relatorio/recepcao'
        }
    ]

    useEffect(() => {
        setTitle('Recebimento de MP')

        const getData = () => {
            api.get(`${staticUrl}/${loggedUnity.unidadeID}`, { headers: { 'function-name': 'getData' } }).then(
                response => {
                    console.log('getData: ', response.data)
                    setFields(response.data.fields)
                    setData(response.data.data)
                    setFieldsProducts(response.data.fieldsProducts)
                    setDataProducts(response.data.dataProducts)
                    setBlocos(response.data.blocos)
                    setInfo(response.data.info)
                    setLoading(false)
                }
            )
        }
        getData()
    }, [])

    // useEffect(() => {
    //     setTimeout(() => {
    //         trigger() // chama a validação do formulário
    //     }, 1000)
    // }, [trigger])

    console.log('fields', fields)

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Card Header */}
                <Card>
                    <FormHeader
                        btnCancel
                        btnSave
                        btnPrint
                        generateReport={generateReport}
                        dataReports={dataReports}
                        handleSubmit={() => handleSubmit(onSubmit)}
                        title='Fornecedor'
                    />

                    {/* Header */}
                    <CardContent>
                        <Grid container spacing={4}>
                            {fields &&
                                fields.map((field, index) => (
                                    <>
                                        <Grid key={index} item xs={12} md={3}>
                                            <FormControl fullWidth>
                                                {/* int (select) */}
                                                {field && field.tipo === 'int' && field.tabela && (
                                                    <Autocomplete
                                                        options={field.options}
                                                        defaultValue={defaultValues?.[field.tabela]}
                                                        getOptionLabel={option => option.nome}
                                                        name={`header.${field.tabela}`}
                                                        {...register(`header.${field.tabela}`, {
                                                            required: field.obrigatorio ? true : false
                                                        })}
                                                        onChange={(event, newValue) => {
                                                            if (newValue) {
                                                                setValue(`header.${field.tabela}`, newValue)
                                                            }
                                                        }}
                                                        renderInput={params => (
                                                            <TextField
                                                                {...params}
                                                                label={field.nomeCampo}
                                                                placeholder={field.nomeCampo}
                                                                error={errors?.header?.[field.tabela] ? true : false}
                                                            />
                                                        )}
                                                    />
                                                )}

                                                {/* Date */}
                                                {field && field.tipo == 'date' && (
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DatePicker
                                                            label='Selecione uma data'
                                                            locale={dayjs.locale('pt-br')}
                                                            format='DD/MM/YYYY'
                                                            defaultValue={dayjs(new Date())}
                                                            renderInput={params => (
                                                                <TextField
                                                                    {...params}
                                                                    variant='outlined'
                                                                    name={`header.${field.nomeColuna}`}
                                                                    {...register(`header.${field.nomeColuna}`, {
                                                                        required: field.obrigatorio ? true : false
                                                                    })}
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                )}

                                                {/* Textfield */}
                                                {field && field.tipo == 'string' && (
                                                    <TextField
                                                        defaultValue={defaultValues[field.nomeColuna] ?? ''}
                                                        label={field.nomeCampo}
                                                        placeholder={field.nomeCampo}
                                                        name={`header.${field.nomeColuna}`}
                                                        aria-describedby='validation-schema-nome'
                                                        error={errors?.header?.[field.nomeColuna] ? true : false}
                                                        {...register(`header.${field.nomeColuna}`, {
                                                            required: !!field.obrigatorio
                                                        })}
                                                        // Validações
                                                        onChange={e => {
                                                            field.nomeColuna == 'cnpj'
                                                                ? (e.target.value = cnpjMask(e.target.value))
                                                                : field.nomeColuna == 'cep'
                                                                ? ((e.target.value = cepMask(e.target.value)),
                                                                  getAddressByCep(e.target.value))
                                                                : field.nomeColuna == 'telefone'
                                                                ? (e.target.value = cellPhoneMask(e.target.value))
                                                                : field.nomeColuna == 'estado'
                                                                ? (e.target.value = ufMask(e.target.value))
                                                                : (e.target.value = e.target.value)
                                                        }}
                                                        // inputProps com maxLength 18 se field.nomeColuna == 'cnpj
                                                        inputProps={
                                                            // inputProps validando maxLength pra cnpj, cep e telefone baseado no field.nomeColuna
                                                            field.nomeColuna == 'cnpj'
                                                                ? { maxLength: 18 }
                                                                : field.nomeColuna == 'cep'
                                                                ? { maxLength: 9 }
                                                                : field.nomeColuna == 'telefone'
                                                                ? { maxLength: 15 }
                                                                : field.nomeColuna == 'estado'
                                                                ? { maxLength: 2 }
                                                                : {}
                                                        }
                                                    />
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </>
                                ))}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Produtos */}
                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 4 }}>
                            PRODUTOS
                        </Typography>
                        <Grid container spacing={4}>
                            {fieldProducts &&
                                dataProducts &&
                                dataProducts.map((data, indexData) =>
                                    fieldProducts.map((field, indexField) => (
                                        <>
                                            {/* Enviar hidden de recebimentompProdutoID */}
                                            <input
                                                type='hidden'
                                                name={`produtos[${indexData}].recebimentompProdutoID`}
                                                defaultValue={data?.recebimentompProdutoID}
                                                {...register(`produtos[${indexData}].recebimentompProdutoID`)}
                                            />

                                            <Grid key={indexData} item xs={12} md={4}>
                                                <FormControl fullWidth>
                                                    {/* int (select) */}
                                                    {field && field.tipo === 'int' && field.tabela && (
                                                        <>
                                                            <Autocomplete
                                                                options={field.options}
                                                                defaultValue={data?.[field.tabela]}
                                                                getOptionLabel={option => option.nome}
                                                                name={`produtos[${indexData}].${field.tabela}`}
                                                                {...register(`produtos[${indexData}].${field.tabela}`, {
                                                                    required: field.obrigatorio ? true : false
                                                                })}
                                                                onChange={(event, newValue) => {
                                                                    if (newValue) {
                                                                        setValue(
                                                                            `produtos[${indexData}].${field.tabela}`,
                                                                            newValue
                                                                        )
                                                                    }
                                                                }}
                                                                renderInput={params => (
                                                                    <TextField
                                                                        {...params}
                                                                        label={field.nomeCampo}
                                                                        placeholder={field.nomeCampo}
                                                                        error={
                                                                            errors?.produtos?.[field.tabela]
                                                                                ? true
                                                                                : false
                                                                        }
                                                                    />
                                                                )}
                                                            />
                                                        </>
                                                    )}

                                                    {/* Textfield */}
                                                    {field && field.tipo == 'string' && (
                                                        <>
                                                            <TextField
                                                                defaultValue={data?.[field.nomeColuna]}
                                                                label={field.nomeCampo}
                                                                placeholder={field.nomeCampo}
                                                                name={`produtos[${indexData}].${field.nomeColuna}`}
                                                                aria-describedby='validation-schema-nome'
                                                                error={
                                                                    errors?.produtos?.[field.nomeColuna] ? true : false
                                                                }
                                                                {...register(
                                                                    `produtos[${indexData}].${field.nomeColuna}`,
                                                                    {
                                                                        required: !!field.obrigatorio
                                                                    }
                                                                )}
                                                                // Validações
                                                                onChange={e => {
                                                                    field.nomeColuna == 'cnpj'
                                                                        ? (e.target.value = cnpjMask(e.target.value))
                                                                        : field.nomeColuna == 'cep'
                                                                        ? ((e.target.value = cepMask(e.target.value)),
                                                                          getAddressByCep(e.target.value))
                                                                        : field.nomeColuna == 'telefone'
                                                                        ? (e.target.value = cellPhoneMask(
                                                                              e.target.value
                                                                          ))
                                                                        : field.nomeColuna == 'estado'
                                                                        ? (e.target.value = ufMask(e.target.value))
                                                                        : (e.target.value = e.target.value)
                                                                }}
                                                                // inputProps com maxLength 18 se field.nomeColuna == 'cnpj
                                                                inputProps={
                                                                    // inputProps validando maxLength pra cnpj, cep e telefone baseado no field.nomeColuna
                                                                    field.nomeColuna == 'cnpj'
                                                                        ? { maxLength: 18 }
                                                                        : field.nomeColuna == 'cep'
                                                                        ? { maxLength: 9 }
                                                                        : field.nomeColuna == 'telefone'
                                                                        ? { maxLength: 15 }
                                                                        : field.nomeColuna == 'estado'
                                                                        ? { maxLength: 2 }
                                                                        : {}
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ))
                                )}
                        </Grid>

                        {/* Botão de adicionar produto */}
                        <Button
                            variant='outlined'
                            color='primary'
                            sx={{ mt: 4 }}
                            startIcon={<Icon icon='material-symbols:add-circle-outline-rounded' />}
                            onClick={() => {
                                addProduct()
                            }}
                        >
                            Inserir produto
                        </Button>
                    </CardContent>
                </Card>

                {/* Blocos */}
                {blocos &&
                    blocos.map((bloco, indexBloco) => (
                        <Card key={indexBloco} sx={{ mt: 4 }}>
                            <CardContent>
                                <Grid container>
                                    {/* Hidden do parRecebimentompBlocoID */}
                                    <input
                                        type='hidden'
                                        name={`blocos[${indexBloco}].parRecebimentompBlocoID`}
                                        defaultValue={bloco.parRecebimentompBlocoID}
                                        {...register(`blocos[${indexBloco}].parRecebimentompBlocoID`)}
                                    />

                                    <Grid item xs={12} md={12}>
                                        <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                            {bloco.nome}
                                        </Typography>
                                    </Grid>

                                    {/* Itens */}
                                    {bloco.itens &&
                                        bloco.itens.map((item, indexItem) => (
                                            <>
                                                <Grid key={indexItem} container spacing={4} sx={{ mb: 4 }}>
                                                    {/* Hidden do itemID */}
                                                    <input
                                                        type='hidden'
                                                        name={`blocos[${indexBloco}].itens[${indexItem}].itemID`}
                                                        defaultValue={item.itemID}
                                                        {...register(
                                                            `blocos[${indexBloco}].itens[${indexItem}].itemID`
                                                        )}
                                                    />

                                                    {/* Descrição do item */}
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        md={6}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '10px'
                                                        }}
                                                    >
                                                        <Icon
                                                            icon={'line-md:circle-to-confirm-circle-transition'}
                                                            style={{
                                                                color: item.resposta ? 'green' : 'grey',
                                                                fontSize: '20px'
                                                            }}
                                                        />
                                                        {item.ordem + ' - ' + item.nome}
                                                    </Grid>

                                                    {/* Alternativas de respostas */}
                                                    <Grid item xs={12} md={3}>
                                                        {/* Tipo de alternativa  */}
                                                        <input
                                                            type='hidden'
                                                            name={`blocos[${indexBloco}].itens[${indexItem}].tipoAlternativa`}
                                                            defaultValue={item.alternativa}
                                                            {...register(
                                                                `blocos[${indexBloco}].itens[${indexItem}].tipoAlternativa`
                                                            )}
                                                        />

                                                        <FormControl fullWidth>
                                                            {/* +1 que umaopção pra selecionar (Select) */}
                                                            {item.alternativas && item.alternativas.length > 1 && (
                                                                <Autocomplete
                                                                    options={item.alternativas}
                                                                    defaultValue={
                                                                        item.resposta
                                                                            ? { nome: item?.resposta }
                                                                            : { nome: '' }
                                                                    }
                                                                    id='autocomplete-outlined'
                                                                    getOptionLabel={option => option.nome}
                                                                    onChange={(event, value) => {
                                                                        setValue(
                                                                            `blocos[${indexBloco}].itens[${indexItem}].respostaID`,
                                                                            value?.alternativaID
                                                                        )
                                                                    }}
                                                                    renderInput={params => (
                                                                        <TextField
                                                                            {...params}
                                                                            name={`blocos[${indexBloco}].itens[${indexItem}].resposta`}
                                                                            label='Selecione uma resposta'
                                                                            placeholder='Selecione uma resposta'
                                                                            {...register(
                                                                                `blocos[${indexBloco}].itens[${indexItem}].resposta`
                                                                            )}
                                                                        />
                                                                    )}
                                                                />
                                                            )}

                                                            {/* Data */}
                                                            {item.alternativas.length == 0 &&
                                                                item.alternativa == 'Data' && (
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
                                                                                    `blocos[${indexBloco}].itens[${indexItem}].resposta`,
                                                                                    newValue
                                                                                )
                                                                            }}
                                                                            renderInput={params => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    variant='outlined'
                                                                                    name={`blocos[${indexBloco}].itens[${indexItem}].resposta`}
                                                                                    {...register(
                                                                                        `blocos[${indexBloco}].itens[${indexItem}].resposta`
                                                                                    )}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </LocalizationProvider>
                                                                )}

                                                            {/* Dissertativa */}
                                                            {item.alternativas.length == 0 &&
                                                                item.alternativa == 'Dissertativa' && (
                                                                    <TextField
                                                                        multiline
                                                                        label='Descreva a resposta'
                                                                        placeholder='Descreva a resposta'
                                                                        name={`blocos[${indexBloco}].itens[${indexItem}].resposta`}
                                                                        defaultValue={item.resposta ?? ''}
                                                                        {...register(
                                                                            `blocos[${indexBloco}].itens[${indexItem}].resposta`
                                                                        )}
                                                                    />
                                                                )}
                                                        </FormControl>
                                                    </Grid>

                                                    {/* Obs */}
                                                    {item && item.obs == 1 && (
                                                        <Grid item xs={12} md={3}>
                                                            <FormControl fullWidth>
                                                                <TextField
                                                                    label='Observação'
                                                                    placeholder='Observação'
                                                                    name={`blocos[${indexBloco}].itens[${indexItem}].observacao`}
                                                                    defaultValue={item.observacao ?? ''}
                                                                    {...register(
                                                                        `blocos[${indexBloco}].itens[${indexItem}].observacao`
                                                                    )}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}

                {/* Observação do formulário */}
                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={12}>
                                <FormControl fullWidth>
                                    <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                                        Observações (campo de uso exclusivo da validadora)
                                    </Typography>
                                    <TextField
                                        multiline
                                        rows={4}
                                        label='Observação (opcional)'
                                        placeholder='Observação (opcional)'
                                        name='obs'
                                        defaultValue={info.obs ?? ''}
                                        {...register('obs')}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Resultado do formulário */}
                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={12}>
                                <FormControl fullWidth>
                                    <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                                        Resultado
                                    </Typography>

                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={12}>
                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        name='status'
                                                        value={70}
                                                        checked={info.status == 70}
                                                        {...register('status')}
                                                        onChange={handleRadioChange}
                                                    />
                                                }
                                                label='Aprovado'
                                            />

                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        name='status'
                                                        value={60}
                                                        checked={info.status == 60}
                                                        {...register('status')}
                                                        onChange={handleRadioChange}
                                                    />
                                                }
                                                label='Aprovado Parcial'
                                            />

                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        name='status'
                                                        value={50}
                                                        checked={info.status == 50}
                                                        {...register('status')}
                                                        onChange={handleRadioChange}
                                                    />
                                                }
                                                label='Reprovado'
                                            />
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </form>
        </>
    )
}

export default FormRecebimentoMp

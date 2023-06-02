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
    IconButton,
    ListItem,
    ListItemButton,
    Radio,
    RadioGroup,
    TextField,
    Tooltip,
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
import { formType, toastMessage } from 'src/configs/defaultConfigs'
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
    const [isLoading, setLoading] = useState(false)
    const [savingForm, setSavingForm] = useState(false)
    const [validateForm, setValidateForm] = useState(false) //? Se true, valida campos obrigatórios

    const [fields, setFields] = useState([])
    const [data, setData] = useState(null)
    const [fieldProducts, setFieldsProducts] = useState([])
    const [dataProducts, setDataProducts] = useState([])
    const [removedProducts, setRemovedProducts] = useState([])
    const [blocos, setBlocos] = useState([])
    const [info, setInfo] = useState('')

    const router = Router
    const { id } = router.query
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const type = formType(router.pathname) // Verifica se é novo ou edição

    const { settings } = useContext(SettingsContext)
    const mode = settings.mode

    // const defaultValues =
    //     data &&
    //     fields.reduce((defaultValues, field) => {
    //         if (field.tabela) {
    //             // Select (objeto com id e nome)
    //             defaultValues[field.tabela] = {
    //                 id: data[field.tabela]?.id,
    //                 nome: data[field.tabela]?.nome
    //             }
    //         } else {
    //             // Input
    //             defaultValues[field.nomeColuna] = data[field.nomeColuna]
    //         }

    //         return defaultValues
    //     }, {})

    const {
        watch,
        trigger,
        reset,
        register,
        control,
        setValue,
        handleSubmit,
        remove,
        formState: { errors }
    } = useForm()

    console.log('errors: ', errors)
    console.log('isLoading: ', isLoading)

    const initializeValues = values => {
        console.log('🚀 ~ initializeValues values:', values)

        // Seta fields do cabeçalho
        // values.fields.map((field, index) => {
        //     if (defaultValues?.[field.tabela]) {
        //         setValue(`header.${field.tabela}`, defaultValues?.[field.tabela])
        //     }
        // })

        // Seta autocomplete com o valor do banco em um objeto com id e nome
        values.dataProducts.map((data, indexData) => {
            values.fieldsProducts.map((field, indexFields) => {
                if (data?.[field.tabela]?.id) {
                    setValue(`produtos[${indexData}].${field.tabela}`, data?.[field.tabela])
                }
            })
        })

        // Seta bloco com o valor do banco em um objeto com id e nome
        values.blocos.map((block, indexBlock) => {
            block.itens.map((item, indexItem) => {
                if (item?.respostaID) {
                    setValue(`blocos[${indexBlock}].itens[${indexItem}].respostaID`, item?.respostaID)
                }
                if (item?.resposta) {
                    setValue(`blocos[${indexBlock}].itens[${indexItem}].resposta`, item?.resposta)
                }
            })
        })

        // Seta infos
        setValue('obs', values?.info?.obs)
        setValue('status', values?.info?.status)
    }

    const removeProduct = (data, index) => {
        // Remova o item do array dataProducts
        const updatedDataProducts = [...dataProducts]
        updatedDataProducts.splice(index, 1)
        setDataProducts(updatedDataProducts)

        // Insere ID no array de produtos removidos
        if (data?.recebimentompProdutoID > 0) {
            const newRemovedProducts = [...removedProducts, { recebimentompProdutoID: data.recebimentompProdutoID }] // Atribui o valor atual a uma nova variável
            console.log('🚀 ~ newRemovedProducts:', newRemovedProducts)
            setRemovedProducts(newRemovedProducts) // Atualiza a variável de estado
        }

        reset({ produtos: updatedDataProducts })
        // trigger()
    }

    //* Altera status do formulário (aprovado, aprovado parcial, reprovado)
    const handleChangeFormStatus = event => {
        const newValue = event.target.value

        const newInfo = {
            ...info,
            status: newValue
        }
        setInfo(newInfo)
        setValue('header.status', newValue)
    }

    const onSubmit = async data => {
        console.log('onSubmit: ', data)

        try {
            setSavingForm(true)
            if (type == 'edit') {
                await api
                    .put(`${staticUrl}/${id}`, {
                        data: data,
                        removedProducts: removedProducts,
                        unidadeID: loggedUnity.unidadeID
                    })
                    .then(response => {
                        toast.success(toastMessage.successUpdate)
                        setSavingForm(false)
                    })
            } else if (type == 'new') {
                await api
                    .post(`${staticUrl}/insertData`, {
                        data: data,
                        unidadeID: loggedUnity.unidadeID
                    })
                    .then(response => {
                        const newId = response.data
                        router.push(`${staticUrl}/${newId}`)
                        toast.success(toastMessage.successNew)
                        setSavingForm(false)
                    })
            } else {
                toast.error(toastMessage.error)
                setSavingForm(false)
            }
        } catch (error) {
            console.log(error)
        }
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

    const getData = () => {
        setLoading(true)
        api.post(`${staticUrl}/getData/${id}`, { type: type, unidadeID: loggedUnity.unidadeID }).then(response => {
            console.log('getData: ', response.data)

            setFields(response.data.fields)
            setData(response.data.data)
            setFieldsProducts(response.data.fieldsProducts)
            setDataProducts(response.data.dataProducts)
            setBlocos(response.data.blocos)
            setInfo(response.data.info)

            setLoading(false)

            // initializeValues(response.data)
        })
    }

    useEffect(() => {
        console.log('useEffect 1')
        setTitle('Recebimento de MP')
        getData()
    }, [savingForm])

    // preencher campos defauylts com os dados do banco
    useEffect(() => {
        if (data) {
            console.log('useEffect 2')
            fields.map((field, index) => {
                setValue(`header.${field.tabela}`, data?.[field.tabela])
            })

            // Seta autocomplete com o valor do banco em um objeto com id e nome
            dataProducts.map((data, indexData) => {
                fieldProducts.map((field, indexFields) => {
                    if (data?.[field.tabela]?.id) {
                        setValue(`produtos[${indexData}].${field.tabela}`, data?.[field.tabela])
                    }
                })
            })

            // Seta bloco com o valor do banco em um objeto com id e nome
            blocos.map((block, indexBlock) => {
                block.itens.map((item, indexItem) => {
                    if (item?.resposta) {
                        setValue(`blocos[${indexBlock}].itens[${indexItem}].resposta`, item?.resposta)
                    }
                })
            })

            // Seta infos
            setValue('obs', info?.obs)
            setValue('status', info?.status)
        }
    }, [data, savingForm])

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
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
                                                            getOptionSelected={(option, value) =>
                                                                option.id === value.id
                                                            }
                                                            // defaultValue={
                                                            //     defaultValues?.[field.tabela]?.id
                                                            //         ? defaultValues?.[field.tabela]
                                                            //         : null
                                                            // }
                                                            defaultValue={
                                                                data?.[field.tabela]?.id ? data?.[field.tabela] : null
                                                            }
                                                            getOptionLabel={option => option.nome}
                                                            name={`header.${field.tabela}`}
                                                            {...register(`header.${field.tabela}`)}
                                                            onChange={(event, newValue) => {
                                                                console.log('🚀 ~ newValue:', newValue)
                                                                setValue(
                                                                    `header.${field.tabela}`,
                                                                    newValue ? newValue : null
                                                                )
                                                            }}
                                                            renderInput={params => (
                                                                <TextField
                                                                    {...params}
                                                                    label={field.nomeCampo}
                                                                    placeholder={field.nomeCampo}
                                                                    error={
                                                                        errors?.header?.[field.tabela] ? true : false
                                                                    }
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
                                                                        {...register(`header.${field.nomeColuna}`)}
                                                                    />
                                                                )}
                                                            />
                                                        </LocalizationProvider>
                                                    )}

                                                    {/* Textfield */}
                                                    {field && field.tipo == 'string' && (
                                                        <TextField
                                                            defaultValue={data?.[field.nomeColuna] ?? ''}
                                                            label={field.nomeCampo}
                                                            placeholder={field.nomeCampo}
                                                            name={`header.${field.nomeColuna}`}
                                                            aria-describedby='validation-schema-nome'
                                                            error={errors?.header?.[field.nomeColuna] ? true : false}
                                                            {...register(`header.${field.nomeColuna}`)}
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
                            <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 5 }}>
                                PRODUTOS
                            </Typography>
                            {fieldProducts &&
                                dataProducts &&
                                dataProducts.map((data, indexData) => (
                                    <Grid
                                        id={`productLine-${indexData}`}
                                        container
                                        spacing={4}
                                        key={indexData}
                                        sx={{ mb: 3 }}
                                    >
                                        {fieldProducts.map((field, indexField) => (
                                            <Grid item xs={12} md={12 / fieldProducts.length} key={indexField}>
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
                                                            options={field.options}
                                                            defaultValue={
                                                                data?.[field.tabela]?.id ? data?.[field.tabela] : null
                                                            }
                                                            getOptionLabel={option => option.nome}
                                                            name={`produtos[${indexData}].${field.tabela}`}
                                                            {...register(`produtos[${indexData}].${field.tabela}`)}
                                                            onChange={(event, newValue) => {
                                                                setValue(
                                                                    `produtos[${indexData}].${field.tabela}`,
                                                                    newValue ? newValue : null
                                                                )
                                                            }}
                                                            renderInput={params => (
                                                                <TextField
                                                                    {...params}
                                                                    label={field.nomeCampo}
                                                                    placeholder={field.nomeCampo}
                                                                    error={
                                                                        errors?.produtos?.[indexData]?.[field.tabela]
                                                                            ? true
                                                                            : false
                                                                    }
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
                                                                    error={
                                                                        errors?.produtos?.[indexData]?.[
                                                                            field.nomeColuna
                                                                        ]
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    {...register(
                                                                        `produtos[${indexData}].${field.nomeColuna}`
                                                                    )}
                                                                    // Validações
                                                                    onChange={e => {
                                                                        field.nomeColuna === 'cnpj'
                                                                            ? (e.target.value = cnpjMask(
                                                                                  e.target.value
                                                                              ))
                                                                            : field.nomeColuna === 'cep'
                                                                            ? ((e.target.value = cepMask(
                                                                                  e.target.value
                                                                              )),
                                                                              getAddressByCep(e.target.value))
                                                                            : field.nomeColuna === 'telefone'
                                                                            ? (e.target.value = cellPhoneMask(
                                                                                  e.target.value
                                                                              ))
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
                                                        {indexField == fieldProducts.length - 1 && (
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
                                                                            2 === 1
                                                                                ? null
                                                                                : removeProduct(data, indexData)
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
                                        ))}
                                    </Grid>
                                ))}

                            {/* Botão de adicionar produto */}
                            <Button
                                variant='outlined'
                                color='primary'
                                sx={{ mt: 1 }}
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
                                                            <Box>
                                                                <Icon
                                                                    icon={'line-md:circle-to-confirm-circle-transition'}
                                                                    style={{
                                                                        color: item.resposta ? 'green' : 'grey',
                                                                        fontSize: '20px'
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Box>{item.ordem + ' - ' + item.nome}</Box>
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
                                                                {/* +1 opção pra selecionar (Select) */}
                                                                {item &&
                                                                    item.alternativas &&
                                                                    item.alternativas.length > 1 && (
                                                                        <Autocomplete
                                                                            options={item.alternativas}
                                                                            getOptionLabel={option => option.nome}
                                                                            // Se pelo menus uma opção ser selecionada, pintar a borda do autocomplete de ver
                                                                            defaultValue={
                                                                                item.resposta
                                                                                    ? item.resposta
                                                                                    : { nome: '' }
                                                                            }
                                                                            name={`blocos[${indexBloco}].itens[${indexItem}].resposta`}
                                                                            {...register(
                                                                                `blocos[${indexBloco}].itens[${indexItem}].resposta`
                                                                            )}
                                                                            onChange={(event, newValue) => {
                                                                                console.log('🚀 ~ newValue:', newValue)
                                                                                setValue(
                                                                                    `blocos[${indexBloco}].itens[${indexItem}].resposta`,
                                                                                    newValue
                                                                                        ? {
                                                                                              id: newValue.alternativaID,
                                                                                              nome: newValue.nome
                                                                                          }
                                                                                        : ''
                                                                                )
                                                                            }}
                                                                            renderInput={params => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    label='Selecione uma resposta'
                                                                                    placeholder='Selecione uma resposta'
                                                                                    // Se uma opções for selecionada, pintar a borda do autocomplete de verde
                                                                                    error={
                                                                                        errors?.blocos?.[indexBloco]
                                                                                            ?.itens[indexItem]?.resposta
                                                                                            ? true
                                                                                            : false
                                                                                    }
                                                                                />
                                                                            )}
                                                                        />
                                                                    )}

                                                                {/* Data */}
                                                                {item.alternativas.length == 0 &&
                                                                    item.alternativa == 'Data' && (
                                                                        <LocalizationProvider
                                                                            dateAdapter={AdapterDayjs}
                                                                        >
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
                                                                                        newValue ? newValue : ''
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
                                                                            error={
                                                                                errors?.blocos?.[indexBloco]?.itens[
                                                                                    indexItem
                                                                                ]?.resposta
                                                                                    ? true
                                                                                    : false
                                                                            }
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
                    {info && (
                        <>
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
                                                    defaultValue={info.obs ?? ''}
                                                    name='obs'
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
                                                {info && (
                                                    <Box display='flex' gap={8}>
                                                        <RadioGroup
                                                            row
                                                            aria-label='colored'
                                                            name='colored'
                                                            value={info.status}
                                                            onChange={handleChangeFormStatus}
                                                        >
                                                            <FormControlLabel
                                                                value={70}
                                                                // disabled={hasFormPending}
                                                                name={`status`}
                                                                {...register(`status`)}
                                                                control={<Radio color='success' />}
                                                                label='Aprovado'
                                                            />
                                                            <FormControlLabel
                                                                value={60}
                                                                // disabled={hasFormPending}
                                                                name={`status`}
                                                                {...register(`status`)}
                                                                label='Aprovado parcial'
                                                                control={<Radio color='warning' />}
                                                            />
                                                            <FormControlLabel
                                                                value={50}
                                                                // disabled={hasFormPending}
                                                                name={`status`}
                                                                {...register(`status`)}
                                                                label='Reprovado'
                                                                control={<Radio color='error' />}
                                                            />
                                                        </RadioGroup>
                                                    </Box>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </form>
            )}
        </>
    )
}

export default FormRecebimentoMp

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
import { RouteContext } from 'src/context/RouteContext'
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

const FormRecebimentoMp = ({ id }) => {
    const { user, loggedUnity } = useContext(AuthContext)
    const { setTitle } = useContext(ParametersContext)
    const [isLoading, setLoading] = useState(true)

    const [fields, setFields] = useState([])
    const [data, setData] = useState(null)
    const [fieldProducts, setFieldsProducts] = useState([])
    const [dataProducts, setDataProducts] = useState([])
    const [blocos, setBlocos] = useState([])
    const [info, setInfo] = useState('')
<<<<<<< HEAD
    const [openModal, setOpenModal] = useState(false)
    const [listErrors, setListErrors] = useState({ status: false, errors: [] })
    const { settings } = useContext(SettingsContext)
    const { setId } = useContext(RouteContext)
=======
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b

    const router = Router
<<<<<<< HEAD
    const type = id && id > 0 ? 'edit' : 'new'
    const staticUrl = router.pathname
=======
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
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b

    const {
        watch,
        register,
<<<<<<< HEAD
        getValues,
=======
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
        control,
        setValue,
        handleSubmit,
        formState: { errors },
        trigger
    } = useForm({ mode: 'onBlur' })

    console.log('errors: ', errors)

    // fields.map((field, index) => {
    //     setValue(`header.${field.tabela}`, defaultValues?.[field.tabela])
    // })

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

<<<<<<< HEAD
    const verifyFormPending = async () => {
        try {
            const parFormularioID = 2
            await api.post(`${staticUrl}/verifyFormPending/${id}`, { parFormularioID }).then(response => {
                setHasFormPending(response.data) //! true/false
            })
        } catch (error) {
            console.log(error)
        }
    }

    const getNewData = () => {
        try {
            setLoading(true)
            api.post(`${staticUrl}/getNewData`, { unidadeID: loggedUnity.unidadeID }).then(response => {
                setFields(response.data.fields)
                setFieldsProducts(response.data.fieldsProducts)
                setDataProducts(response.data.dataProducts)
                setBlocos(response.data.blocos)
                setInfo(response.data.info)

                setCanEdit({
                    status: true,
                    message:
                        'Esse formulário já foi concluído! Para alterá-lo é necessário atualizar seu Status para "Em preenchimento" através do botão "Status"!',
                    messageType: 'info'
                })

                setLoading(false)
            })
        } catch (error) {
            console.log('🚀 ~ error:', error)
        }
    }

    const getData = () => {
        setLoading(true)
        if (id) {
            api.post(`${staticUrl}/getData/${id}`, { type: type, unidadeID: loggedUnity.unidadeID }).then(response => {
                setFields(response.data.fields)
                setData(response.data.data)
                setFieldsProducts(response.data.fieldsProducts)
                setDataProducts(response.data.dataProducts)
                setBlocos(response.data.blocos)
                setInfo(response.data.info)
                initializeValues(response.data)

                let objStatus = statusDefault[response?.data?.info?.status]
                setStatus(objStatus)

                setCanEdit({
                    status: response?.data?.info?.status < 40 ? true : false,
                    message:
                        'Esse formulário já foi concluído! Para alterá-lo é necessário atualizar seu Status para "Em preenchimento" através do botão "Status"!',
                    messageType: 'info'
                })

                verifyFormPending()
                setLoading(false)
            })
        }
    }

    const removeProduct = (value, index) => {
        if (dataProducts.length == 1) {
            toast.error('Você deve ter ao menos um produto!')
            return
        }

        // Remove o item do array dataProducts
        const updatedDataProducts = [...dataProducts]
        updatedDataProducts.splice(index, 1)
        setDataProducts(updatedDataProducts)

        // Insere ID no array de produtos removidos
        if (value?.recebimentompProdutoID > 0) {
            const newRemovedProducts = [...removedProducts, { recebimentompProdutoID: value.recebimentompProdutoID }] // Atribui o valor atual a uma nova variável
            setRemovedProducts(newRemovedProducts) // Atualiza a variável de estado
        }

        reset({
            ...getValues(), // Obtém os valores atuais de todos os campos
            produtos: updatedDataProducts // Atualiza apenas o campo "produtos"
        })
        trigger()

        toast.success('Produto pré-removido. Salve para concluir!')
    }

    const initializeValues = values => {
        values?.fields?.map(field => {
            if (field.tipo == 'int') {
                setValue(`header.${field.tabela}`, values.data?.[field.tabela] ? values.data?.[field.tabela] : null)
            } else if (field.tipo == 'date') {
                setValue(
                    `header.${field.nomeColuna}`,
                    new Date(values.data?.[field.nomeColuna]).toISOString().split('T')[0]
                )
            } else {
                setValue(`header.${field.nomeColuna}`, values.data?.[field.nomeColuna])
            }
        })

        // Seta autocomplete com o valor do banco em um objeto com id e nome
        values?.dataProducts?.map((data, indexData) => {
            values?.fieldsProducts?.map((field, indexFields) => {
                if (field.tipo == 'int') {
                    console.log('🚀 ~ data?.[field.tabela]:', data?.[field.tabela])
                    setValue(
                        `produtos[${indexData}].${field.tabela}`,
                        data?.[field.tabela] ? data?.[field.tabela] : null
                    )
                } else {
                    setValue(`produtos[${indexData}].${field.nomeColuna}`, data?.[field.nomeColuna])
                }
            })
        })

        // Seta bloco com o valor do banco em um objeto com id e nome
        values?.blocos?.map((block, indexBlock) => {
            block?.itens?.map((item, indexItem) => {
                if (item?.resposta) {
                    setValue(`blocos[${indexBlock}].itens[${indexItem}].resposta`, item?.resposta)
                }
            })
        })

        // Seta infos
        setValue('obs', values.info?.obs)
        setValue('status', values.info?.status)
    }

    const checkErrors = () => {
        clearErrors()
        let hasErrors = false
        let arrErrors = []

        //? Header
        fieldsState?.forEach((field, index) => {
            const fieldName = field.tabela ? `header.${field.tabela}` : `header.${field.nomeColuna}`
            const fieldValue = getValues(fieldName)
            if (field.obrigatorio === 1 && !fieldValue) {
                setError(fieldName, {
                    type: 'manual',
                    message: 'Campo obrigatório'
                })
                arrErrors.push(field?.nomeCampo)
                hasErrors = true
            }
        })

        //? Produtos
        dataProducts.forEach((data, indexData) => {
            fieldProducts.forEach((field, indexField) => {
                const fieldName = field.tabela
                    ? `produtos[${indexData}].${field.tabela}`
                    : `produtos[${indexData}].${field.nomeColuna}`
                const fieldValue = getValues(fieldName)

                if (field.obrigatorio === 1 && !fieldValue) {
                    setError(fieldName, {
                        type: 'manual',
                        message: 'Campo obrigatário'
                    })
                    arrErrors.push(field?.nomeCampo)
                    hasErrors = true
                }
            })
        })

        //? Blocos
        blocos.forEach((block, indexBlock) => {
            block.itens.forEach((item, indexItem) => {
                const fieldValue = getValues(`blocos[${indexBlock}].itens[${indexItem}].resposta`)
                if (item?.obrigatorio === 1 && !fieldValue) {
                    setError(`blocos[${indexBlock}].itens[${indexItem}].resposta`, {
                        type: 'manual',
                        message: 'Campo obrigatário'
                    })
                    arrErrors.push(item?.nome)
                    hasErrors = true
                }
            })
        })

        setListErrors({
            status: hasErrors,
            errors: arrErrors
        })
    }

    const handleSendForm = () => {
        checkErrors()
        setOpenModal(true)
        setValidateForm(true)
    }

    const conclusionForm = async values => {
        values['conclusion'] = true

        await handleSubmit(onSubmit)(values)
    }

    const onSubmit = async (values, param = false) => {
        if (param.conclusion === true && param.status > 10) {
            values['status'] = param.status
            values['obsConclusao'] = param.obsConclusao
        }

        const data = {
            forms: {
                ...values,
                header: {
                    ...values.header
                },
                produtos: [...values.produtos],
                removedProducts: removedProducts
            },
            auth: {
                usuarioID: user.usuarioID,
                papelID: user.papelID,
                unidadeID: loggedUnity.unidadeID
            }
        }
        try {
            if (type == 'edit') {
                setSavingForm(true)
                await api.put(`${staticUrl}/updateData`, data).then(response => {
                    toast.success(toastMessage.successUpdate)
                    setSavingForm(false)
                })
            } else if (type == 'new') {
                await api.post(`${backRoute(staticUrl)}/insertData`, data).then(response => {
                    router.push(`${backRoute(staticUrl)}`) //? backRoute pra remover 'novo' da rota
                    setId(response.data)
                    toast.success(toastMessage.successNew)
                })
            } else {
                toast.error(toastMessage.error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setTitle('Recebimento de MP')
        type == 'new' ? getNewData() : getData()
    }, [id, savingForm])
=======
    useEffect(() => {
        setTitle('Recebimento de MP')
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b

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

<<<<<<< HEAD
                    {/* Card Header */}
                    <Card>
                        <FormHeader
                            btnCancel
                            btnSave={info?.status < 40 || type == 'new'}
                            btnSend={type == 'edit' ? true : false}
                            btnPrint
                            generateReport={generateReport}
                            dataReports={dataReports}
                            handleSubmit={() => handleSubmit(onSubmit)}
                            handleSend={handleSendForm}
                            title='Recebimento MP'
                            btnStatus={type == 'edit' ? true : false}
                            handleBtnStatus={() => setOpenModalStatus(true)}
                            type={type}
                        />

                        {/* Header */}
                        <CardContent>
                            {/* Status */}
                            <Box sx={{ mb: 4 }}>
                                <Box display='flex' alignItems='center' justifyContent='flex-end'>
                                    <CustomChip
                                        size='small'
                                        skin='light'
                                        color={status?.color ?? 'primary'}
                                        label={status?.title ?? 'Novo preenchimento'}
                                        sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
                                    />
                                </Box>
                            </Box>

                            <Fields
                                register={register}
                                errors={errors}
                                setValue={setValue}
                                fields={fieldsState}
                                values={data}
                                control={control}
                                disabled={!canEdit.status}
                            />
                        </CardContent>
                    </Card>

                    {/* Produtos */}
                    <Card sx={{ mt: 4 }}>
                        <CardContent>
                            <Typography color='primary' variant='subtitle1' sx={{ fontWeight: 700, mb: 5 }}>
                                PRODUTOS
                            </Typography>
                            {fieldProducts &&
                                dataProducts &&
                                dataProducts.map((data, indexData) => (
                                    <Box
                                        display='flex'
                                        justifyContent='space-between'
                                        gap={4}
                                        key={indexData}
                                        sx={{ mb: 4 }}
                                    >
                                        {/* Monta as colunas dinâmicas dos produtos */}
                                        {fieldProducts.map((field, indexField) => (
                                            <Box flex={1} key={indexField}>
                                                <Product
                                                    field={field}
                                                    data={data}
                                                    indexData={indexData}
                                                    disabled={!canEdit.status}
                                                    register={register}
                                                    setValue={setValue}
                                                    errors={errors}
                                                />
                                            </Box>
                                        ))}
                                        {/* Delete */}
                                        <Remove
                                            xs={12}
                                            md={1}
                                            title='Remover'
                                            index={indexData}
                                            removeItem={removeProduct}
                                            item={data}
                                            pending={!canEdit.status}
                                            textSuccess='Remover este item'
                                            textError='Este item não pode mais ser removido pois já foi respondido em um formulário'
                                        />
                                    </Box>
                                ))}

                            {/* Botão de adicionar produto */}
                            <Button
                                variant='outlined'
                                color='primary'
                                disabled={!canEdit.status}
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
                        blocos.map((bloco, index) => (
                            <Block
                                key={index}
                                index={index}
                                blockKey={`parRecebimentompBlocoID`}
                                values={bloco}
                                register={register}
                                setValue={setValue}
                                control={control}
                                errors={errors}
                                isDisabled={!canEdit.status}
                            />
                        ))}

                    {/* Observação do formulário */}
                    {info && (
                        <>
                            <Card sx={{ mt: 4 }}>
                                <CardContent>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={12}>
=======
                    {/* Header */}
                    <CardContent>
                        <Grid container spacing={4}>
                            {fields &&
                                fields.map((field, index) => (
                                    <>
                                        <Grid key={index} item xs={12} md={3}>
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
                                            <FormControl fullWidth>
                                                {/* int (select) */}
                                                {field && field.tipo === 'int' && field.tabela && (
                                                    <Autocomplete
                                                        options={field.options}
                                                        defaultValue={defaultValues?.[field.tabela]}
                                                        getOptionLabel={option => option.nome}
                                                        name={`header.${field.tabela}`}
                                                        {...register(`header.${field.tabela}`, {
                                                            required: !!field.obrigatorio
                                                        })}
                                                        onChange={(event, newValue) => {
                                                            setValue(`header.${field.tabela}`, newValue ? newValue : '')
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
                                                                    required: true
                                                                })}
                                                                onChange={(event, newValue) => {
                                                                    setValue(
                                                                        `produtos[${indexData}].${field.tabela}`,
                                                                        newValue ? newValue : ''
                                                                    )
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
                                                            {/* +1 opção pra selecionar (Select) */}
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
                                                                    name={`blocos[${indexBloco}].itens[${indexItem}].resposta`}
                                                                    {...register(
                                                                        `blocos[${indexBloco}].itens[${indexItem}].resposta`,
                                                                        { required: true }
                                                                    )}
                                                                    // onChange={(event, value) => {
                                                                    //     setValue(
                                                                    //         `blocos[${indexBloco}].itens[${indexItem}].respostaID`,
                                                                    //         value.alternativaID
                                                                    //             ? value.alternativaID
                                                                    //             : ''
                                                                    //     )
                                                                    // }}
                                                                    renderInput={params => (
                                                                        <TextField
                                                                            {...params}
                                                                            label='Selecione uma resposta'
                                                                            placeholder='Selecione uma resposta'
                                                                            // error={
                                                                            //     errors?.blocos[indexBloco]?.itens[
                                                                            //         indexItem
                                                                            //     ]?.respostaID
                                                                            //         ? true
                                                                            //         : false
                                                                            // }
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
                                                                                    newValue ? newValue : ''
                                                                                )
                                                                            }}
                                                                            renderInput={params => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    variant='outlined'
                                                                                    name={`blocos[${indexBloco}].itens[${indexItem}].resposta`}
                                                                                    {...register(
                                                                                        `blocos[${indexBloco}].itens[${indexItem}].resposta`,
                                                                                        { required: !!item.obrigatorio }
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
                                                                            `blocos[${indexBloco}].itens[${indexItem}].resposta`,
                                                                            { required: !!item.obrigatorio }
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

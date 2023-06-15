// import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

//* Default Form Components
import Fields from 'src/components/Defaults/Formularios/Fields'
import Product from 'src/components/Defaults/Formularios/Product'
import Block from 'src/components/Defaults/Formularios/Block'
import DialogFormStatus from '../Defaults/Dialogs/DialogFormStatus'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

import {
    Alert,
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
import { backRoute, toastMessage, formType, statusDefault, dateConfig } from 'src/configs/defaultConfigs'
import { generateReport } from 'src/configs/defaultConfigs'
import { api } from 'src/configs/api'
import FormHeader from 'src/components/Defaults/FormHeader'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import Loading from 'src/components/Loading'
import toast from 'react-hot-toast'
import { Checkbox } from '@mui/material'
import { SettingsContext } from 'src/@core/context/settingsContext'
import DialogFormConclusion from '../Defaults/Dialogs/DialogFormConclusion'
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
    const [hasFormPending, setHasFormPending] = useState(true) //? Tem pendencia no formulário (já vinculado em formulário de recebimento, não altera mais o status)
    const [status, setStatus] = useState(null)

    const [openModalStatus, setOpenModalStatus] = useState(false)
    const [fieldsState, setFields] = useState([])
    const [data, setData] = useState(null)
    const [fieldProducts, setFieldsProducts] = useState([])
    const [dataProducts, setDataProducts] = useState([])
    const [removedProducts, setRemovedProducts] = useState([])
    const [blocos, setBlocos] = useState([])
    const [info, setInfo] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [listErrors, setListErrors] = useState({ status: false, errors: [] })

    const [canEdit, setCanEdit] = useState({
        status: false,
        message: 'Você não tem permissões',
        messageType: 'info'
    })

    const router = Router
    const { id } = router.query
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const type = formType(router.pathname) // Verifica se é novo ou edição

    const { settings } = useContext(SettingsContext)

    const {
        trigger,
        reset,
        register,
        getValues,
        setValue,
        handleSubmit,
        clearErrors,
        setError,
        formState: { errors }
    } = useForm()

    console.log('errors: ', errors)
    console.log('listErrors: ', listErrors)

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

    //* Reabre o formulário pro fornecedor alterar novamente se ainda nao estiver vinculado com recebimento
    const changeFormStatus = async status => {
        const data = {
            status: status,
            auth: {
                usuarioID: user.usuarioID,
                papelID: user.papelID,
                unidadeID: loggedUnity.unidadeID
            }
        }

        try {
            setSavingForm(true)
            await api.post(`${staticUrl}/changeFormStatus/${id}`, data).then(response => {
                toast.success(toastMessage.successUpdate)
                setSavingForm(false)
            })
        } catch (error) {
            console.log(error)
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
        console.log('🚀 ~ getNewData')
        try {
            setLoading(true)
            api.post(`${staticUrl}/getNewData`, { unidadeID: loggedUnity.unidadeID }).then(response => {
                console.log('🚀 ~ response new data:', response.data)
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
        api.post(`${staticUrl}/getData/${id}`, { type: type, unidadeID: loggedUnity.unidadeID }).then(response => {
            console.log('getData: ', response.data)

            setFields(response.data.fields)
            setData(response.data.data)
            setFieldsProducts(response.data.fieldsProducts)
            setDataProducts(response.data.dataProducts)
            setBlocos(response.data.blocos)
            setInfo(response.data.info)
            initializeValues(response.data)

            let objStatus = statusDefault[response.data.info.status]
            setStatus(objStatus)

            setCanEdit({
                status: response.data.info.status < 40 ? true : false,
                message:
                    'Esse formulário já foi concluído! Para alterá-lo é necessário atualizar seu Status para "Em preenchimento" através do botão "Status"!',
                messageType: 'info'
            })

            verifyFormPending()
            setLoading(false)
        })
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
            console.log('🚀 ~ newRemovedProducts:', newRemovedProducts)
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
        values.fields.map(field => {
            if (field.tipo == 'int') {
                setValue(`header.${field.tabela}`, values.data?.[field.tabela] ? values.data?.[field.tabela] : null)
            } else {
                setValue(`header.${field.nomeColuna}`, values.data?.[field.nomeColuna])
            }
        })

        // Seta autocomplete com o valor do banco em um objeto com id e nome
        values.dataProducts.map((data, indexData) => {
            values.fieldsProducts.map((field, indexFields) => {
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
        values.blocos.map((block, indexBlock) => {
            block.itens.map((item, indexItem) => {
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
        fieldsState.forEach((field, index) => {
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

        console.log('🚀 ~ arrErrors:', arrErrors)

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
        console.log('🚀 ~ conclusionForm: ', values)

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

        console.log('onSubmit: ', data)
        try {
            if (type == 'edit') {
                setSavingForm(true)
                await api.put(`${staticUrl}/${id}`, data).then(response => {
                    toast.success(toastMessage.successUpdate)
                    setSavingForm(false)
                })
            } else if (type == 'new') {
                await api.post(`${staticUrl}/insertData`, data).then(response => {
                    const newId = response.data
                    router.push(`${staticUrl}/${newId}`)
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
        console.log('useEffect 1')
        setTitle('Recebimento de MP')
        type == 'new' ? getNewData() : getData()
    }, [savingForm])

    useEffect(() => {
        checkErrors()
    }, [])

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Mensagem */}
                    {!canEdit.status && (
                        <Alert severity={canEdit.messageType} sx={{ mb: 2 }}>
                            {canEdit.message}
                        </Alert>
                    )}

                    {/* Card Header */}
                    <Card>
                        <FormHeader
                            btnCancel
                            btnSave={info.status < 40 || type == 'new'}
                            btnSend={type == 'edit' ? true : false}
                            btnPrint
                            generateReport={generateReport}
                            dataReports={dataReports}
                            handleSubmit={() => handleSubmit(onSubmit)}
                            handleSend={handleSendForm}
                            title='Recebimento MP'
                            btnStatus={type == 'edit' ? true : false}
                            handleBtnStatus={() => setOpenModalStatus(true)}
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
                                isDisabled={!canEdit.status}
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
                                                    isDisabled={!canEdit.status}
                                                    register={register}
                                                    setValue={setValue}
                                                    errors={errors}
                                                />
                                            </Box>
                                        ))}
                                        {/* Delete */}
                                        <Box>
                                            <Tooltip
                                                title={
                                                    2 == 1
                                                        ? `Este item não pode mais ser removido pois já foi respondido em um formulário`
                                                        : `Remover este item`
                                                }
                                            >
                                                <IconButton
                                                    color='error'
                                                    disabled={!canEdit.status}
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
                                            <FormControl fullWidth>
                                                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                                                    Observações (campo de uso exclusivo da validadora)
                                                </Typography>
                                                <TextField
                                                    multiline
                                                    rows={4}
                                                    label='Observação (opcional)'
                                                    disabled={!canEdit.status}
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
                        </>
                    )}

                    {/* Dialog pra alterar status do formulário (se formulário estiver concluído e fábrica queira reabrir pro preenchimento do fornecedor) */}
                    {openModalStatus && (
                        <DialogFormStatus
                            id={id}
                            parFormularioID={2} // Recebimento MP
                            formStatus={info.status}
                            hasFormPending={hasFormPending}
                            canChangeStatus={info.status > 30 && !hasFormPending}
                            openModal={openModalStatus}
                            handleClose={() => setOpenModalStatus(false)}
                            title='Histórico do Formulário'
                            text={`Listagem do histórico das movimentações do formulário ${id} de Recebimento de MP.`}
                            btnCancel
                            btnConfirm
                            handleSubmit={changeFormStatus}
                        />
                    )}

                    {/* Dialog de confirmação de envio */}
                    <DialogFormConclusion
                        openModal={openModal}
                        handleClose={() => {
                            setOpenModal(false), setValidateForm(false)
                        }}
                        title='Concluir Formulário'
                        text={`Deseja realmente concluir este formulário?`}
                        info={info}
                        btnCancel
                        btnConfirm
                        btnConfirmColor='primary'
                        conclusionForm={conclusionForm}
                        listErrors={listErrors}
                    />
                </form>
            )}
        </>
    )
}

export default FormRecebimentoMp

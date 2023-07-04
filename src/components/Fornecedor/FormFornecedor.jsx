// import * as React from 'react'
import { useState, useEffect, useContext, useRef, use } from 'react'
import { useForm, Controller } from 'react-hook-form'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import upload from 'src/icon/Upload'

//* Default Form Components
import Fields from 'src/components/Defaults/Formularios/Fields'
import CheckList from 'src/components/Defaults/Formularios/CheckList'
import Block from 'src/components/Defaults/Formularios/Block'

import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    FormControlLabel,
    Grid,
    ListItem,
    ListItemButton,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from '@mui/material'
import Router from 'next/router'
import { backRoute, generateReport } from 'src/configs/defaultConfigs'
import { api } from 'src/configs/api'
import FormHeader from 'src/components/Defaults/FormHeader'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import Loading from 'src/components/Loading'
import { toastMessage, formType, statusDefault, dateConfig } from 'src/configs/defaultConfigs'
import { formatDate } from 'src/configs/conversions'
import toast from 'react-hot-toast'
import { Checkbox } from '@mui/material'
import { SettingsContext } from 'src/@core/context/settingsContext'
import { cnpjMask, cellPhoneMask, cepMask, ufMask } from 'src/configs/masks'
import DialogFormConclusion from '../Defaults/Dialogs/DialogFormConclusion'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// Date
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br' // import locale
import DialogForm from '../Defaults/Dialogs/Dialog'
import DialogFormStatus from '../Defaults/Dialogs/DialogFormStatus'
import Upload from 'src/icon/Upload'

const FormFornecedor = () => {
    const { user, loggedUnity } = useContext(AuthContext)
    const { setTitle } = useContext(ParametersContext)
    const [isLoading, setLoading] = useState(false) //? loading de carregamento da página
    const [isLoadingSave, setLoadingSave] = useState(false) //? dependencia do useEffect pra atualizar a página após salvar
    const [validateForm, setValidateForm] = useState(false) //? Se true, valida campos obrigatórios

    const [fieldsState, setFields] = useState([])
    const [data, setData] = useState(null)
    const [categorias, setCategorias] = useState([])
    const [atividades, setAtividades] = useState([])
    const [sistemasQualidade, setSistemasQualidade] = useState([])
    const [grupoAnexo, setGrupoAnexo] = useState([])

    const [allBlocks, setAllBlocks] = useState([])
    const [blocks, setBlocks] = useState([])

    const [info, setInfo] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [unidade, setUnidade] = useState(null)
    const [status, setStatus] = useState(null)
    const [statusEdit, setStatusEdit] = useState(false)
    const [openModalStatus, setOpenModalStatus] = useState(false)
    const [hasFormPending, setHasFormPending] = useState(true) //? Tem pendencia no formulário (já vinculado em formulário de recebimento, não altera mais o status)
    const [countViewBlocks, setCountViewBlocks] = useState(0)
    const [answers, setAnswers] = useState([])
    const [dateStatus, setDateStatus] = useState({})
    const [listErrors, setListErrors] = useState({ status: false, errors: [] })
    const [copiedDataContext, setCopiedDataContext] = useState(false)
    const [itemAnexoAux, setItemAnexoAux] = useState(null)
    const [arrAnexo, setArrAnexo] = useState([])
    const [arrAnexoRemoved, setArrAnexoRemoved] = useState([])

    const [canEdit, setCanEdit] = useState({
        status: false,
        message: 'Você não tem permissões',
        messageType: 'info'
    })
    const router = Router
    let { id } = router.query
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const type = formType(router.pathname) // Verifica se é novo ou edição

    const { settings } = useContext(SettingsContext)
    const mode = settings.mode

    const {
        watch,
        register,
        control,
        getValues,
        clearErrors,
        setValue,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const dynamicId = localStorage.getItem('dynamicId')
    //! TODO - Verificar para deixar funções em arquivo separado
    const setDynamicId = () => {
        const { id } = router.query
        if (id) {
            localStorage.setItem('dynamicId', id)
        }
    }

    const getDynamicId = () => {
        if (!id) {
            id = dynamicId
        }
        return id
    }

    useEffect(() => {
        const { id } = router.query
        getDynamicId(id)
    }, [])

    useEffect(() => {
        setDynamicId()
    }, [])

    const initializeValues = values => {
        // Seta itens no formulário
        values?.blocos?.map((block, indexBlock) => {
            block?.itens?.map((item, indexItem) => {
                if (item?.resposta) {
                    setValue(`blocos[${indexBlock}].itens[${indexItem}].resposta`, item?.resposta)
                }
            })
        })
        setValue()
    }

    const verifyFormPending = async () => {
        try {
            const parFormularioID = 1
            await api.post(`/formularios/fornecedor/verifyFormPending/${id}`, { parFormularioID }).then(response => {
                setHasFormPending(response.data) //! true/false
            })
        } catch (error) {
            console.log(error)
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
            setLoadingSave(true)
            await api.post(`${staticUrl}/changeFormStatus/${id}`, data).then(response => {
                toast.success(toastMessage.successUpdate)
                setLoadingSave(false)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const updateFormStatus = async () => {
        const data = {
            status: {
                edit: statusEdit, // true/false
                status: info.status
            },
            auth: {
                usuarioID: user.usuarioID,
                papelID: user.papelID,
                unidadeID: loggedUnity.unidadeID
            }
        }

        if (statusEdit) {
            try {
                setLoadingSave(true)
                await api.post(`${staticUrl}/updateFormStatus/${id}`, data).then(response => {
                    toast.success(toastMessage.successUpdate)
                    setLoadingSave(false)
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            toast.error('Não há dados a serem atualizados!')
        }
    }

    //* Altera status do formulário (aprovado, aprovado parcial, reprovado)
    const handleChangeFormStatus = event => {
        const newValue = event.target.value

        const newInfo = {
            ...info,
            status: newValue
        }
        setInfo(newInfo)
    }

    //* Formulário já foi enviado e atualizado, função apenas altera o status e envia o email

    // const conclusionAndSendForm = async () => {
    //     const data = {
    //         usuarioID: user.usuarioID,
    //         unidadeID: loggedUnity.unidadeID,
    //         papelID: user.papelID
    //     }
    //     try {
    //         setLoadingSave(true)
    //         await api.post(`${staticUrl}/conclusionAndSendForm/${id}`, data).then(response => {
    //             if (response.status === 201) {
    //                 toast.error(`Erro ao concluir o formulário!`)
    //             } else if (response.status === 202) {
    //                 toast.error(`Erro ao realizar o envio de email para ${user.email}`)
    //                 toast.success(`Formulário concluído com sucesso!`)
    //                 getData()
    //             } else {
    //                 toast.success(`Formulário concluído com sucesso!`)
    //             }
    //             setOpenModal(false)
    //             setLoadingSave(false)
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

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

    // Nomes e rotas dos relatórios passados para o componente FormHeader/MenuReports
    const dataReports = [
        {
            id: 1,
            name: 'Formulário do fornecedor',
            component: 'Fornecedor',
            route: '/relatorio/fornecedor/dadosFornecedor',
            papelID: user.papelID,
            identification: '01',
            params: {
                fornecedorID: id
            }
        },
        {
            id: 2,
            name: 'Teste relatório1',
            component: 'Fornecedor',
            route: '/relatorio/fornecedor/dadosFornecedor/teste',
            papelID: user.papelID,
            identification: '02'
        },
        {
            id: 3,
            name: 'Teste relatório2',
            component: 'Fornecedor',
            route: '/relatorio/fornecedor/dadosFornecedor/teste2',
            papelID: user.papelID,
            identification: '03'
        }
    ]

    const setVisibleBlocks = (blocks, categorias) => {
        let arrVisibleBlocks = []

        blocks?.map((block, index) => {
            if (canViewBlock(block.categorias, categorias)) {
                //? Fornecedor pode ver o bloco
                arrVisibleBlocks.push(block)
            }
        })

        setBlocks(arrVisibleBlocks)
    }

    const changeCategory = (id, checked) => {
        const arrNewCategory = categorias.map(value => {
            if (value.id === id) {
                return {
                    ...value,
                    checked: checked
                }
            }
            return value
        })
        setCategorias(arrNewCategory)
        setVisibleBlocks(allBlocks, arrNewCategory)
    }

    //! Controla visualização do bloco baseado na categoria e atividade
    const canViewBlock = (arrCategoriasBloco, categorias) => {
        const categoriasBloco = arrCategoriasBloco.map(objeto => objeto.categoriaID)
        const categoriasFornecedor = categorias.filter(objeto => objeto.checked).map(objeto => objeto.id)

        if (categoriasBloco.length !== categoriasFornecedor.length) {
            return false // Se os arrays tiverem comprimentos diferentes, não contêm os mesmos valores
        }

        const sortedCategoriasBloco = [...categoriasBloco].sort()
        const sortedCategoriasFornecedor = [...categoriasFornecedor].sort()

        for (let i = 0; i < sortedCategoriasBloco.length; i++) {
            if (sortedCategoriasBloco[i] !== sortedCategoriasFornecedor[i]) {
                return false // Se houver diferença em qualquer posição, não contêm os mesmos valores
            }
        }

        return true // Se chegou até aqui, os arrays contêm os mesmos valores
    }

    const getData = () => {
        try {
            setLoading(true)
            if (id) {
                api.get(`${staticUrl}/${id}`).then(response => {
                    console.log('getData: ', response.data.grupoAnexo)

                    setFields(response.data.fields)
                    setCategorias(response.data.categorias)
                    setAtividades(response.data.atividades)
                    setSistemasQualidade(response.data.sistemasQualidade)

                    setAllBlocks(response.data.blocos)
                    setVisibleBlocks(response.data.blocos, response.data.categorias)

                    setData(response.data.data)
                    setGrupoAnexo(response.data.grupoAnexo)

                    response.data.grupoAnexo.map((grupo, index) => {
                        grupo.itens.map((item, index) => {
                            if (item.anexo) {
                                arrAnexo.push({
                                    titulo: item.nome,
                                    grupoAnexoItemID: item.grupoanexoitemID,
                                    arquivo: item.anexo,
                                    usuarioID: user.usuarioID,
                                    recebimentoMpID: '',
                                    naoConformidadeID: '',
                                    file: {
                                        status: true,
                                        name: item.anexo.path,
                                        size: item.anexo.size,
                                        type: item.anexo.type,
                                        path: item.anexo.time
                                    }
                                })
                            }
                        })
                    })

                    setInfo(response.data.info)
                    setUnidade(response.data.unidade)

                    initializeValues(response.data)

                    let objStatus = statusDefault[response.data.info.status]
                    setStatus(objStatus)

                    setCanEdit({
                        status: user.papelID == 2 && response.data.info.status < 40 ? true : false,
                        message:
                            user.papelID == 2
                                ? 'Esse formulário já foi concluído e enviado pra fábrica, não é mais possível alterar as informações!'
                                : 'Somente o fornecedor pode alterar as informações deste formulário!',
                        messageType: user.papelID == 2 ? 'warning' : 'info'
                    })

                    setLoading(false)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const noPermissions = () => {
        router.push('/formularios/fornecedor/')
        toast.error('Você não tem permissões para acessar esta página!')
    }

    // const handleSendForm = async () => {
    //     console.log('handleSendForm.....')
    //     handleSubmit(onSubmit)(true)
    // }

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
        if (param.conclusion === true) {
            values['status'] = user && user.papelID == 1 ? param.status : 40 //? Seta o status somente se for fábrica
            values['obsConclusao'] = param.obsConclusao
        }

        const data = {
            forms: {
                ...values,
                header: {
                    ...values.header
                }
            },
            auth: {
                usuarioID: user.usuarioID,
                papelID: user.papelID,
                unidadeID: loggedUnity.unidadeID
            }
        }

        try {
            setLoadingSave(true)
            await api.put(`${staticUrl}/${id}`, data).then(response => {
                toast.success(toastMessage.successUpdate)
                setLoadingSave(false)
            })
        } catch (error) {
            console.log(error)
        }
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

        //? Blocos
        blocks.forEach((block, indexBlock) => {
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

    useEffect(() => {
        setTitle('Formulário do Fornecedor')
        //? Form Fornecedor não tem página NOVO
        type == 'edit' ? getData() : noPermissions()
        verifyFormPending()
    }, [isLoadingSave])

    useEffect(() => {
        checkErrors()
    }, [])

    // Mostra toast se o formulário foi copiado de "MEUS DADOS"
    useEffect(() => {
        if (copiedDataContext) {
            toast.success('Dados copiados com sucesso!')
        }
    }, [copiedDataContext])

    // Quando clicar no botão de foto, o input de foto é clicado abrindo o seletor de arquivos
    const fileInputRef = useRef(null)

    const handleAvatarClick = item => {
        fileInputRef.current.click()
        setItemAnexoAux(item)
    }

    // Quando selecionar um arquivo, o arquivo é adicionado ao array de anexos
    const handleFileSelect = event => {
        const selectedFile = event.target.files[0]

        if (selectedFile?.type !== 'application/pdf') {
            toast.error('Formato de arquivo inválido, selecione um arquivo PDF!')
            return
        }

        const existingAnexo = arrAnexo.find(anexo => anexo.grupoAnexoItemID === itemAnexoAux.grupoanexoitemID)

        if (existingAnexo) {
            const updatedAnexo = {
                ...existingAnexo,
                titulo: itemAnexoAux.nome,
                arquivo: selectedFile,
                file: {
                    status: true,
                    name: selectedFile.name,
                    size: selectedFile.size,
                    type: selectedFile.type,
                    time: new Date().getTime()
                }
            }

            const updatedArrAnexo = arrAnexo.map(anexo => {
                return anexo.grupoAnexoItemID === itemAnexoAux.grupoanexoitemID ? updatedAnexo : anexo
            })
            arrAnexoRemoved.splice(arrAnexoRemoved.indexOf(existingAnexo), 1)

            setArrAnexo(updatedArrAnexo)
        } else {
            const newAnexo = {
                titulo: itemAnexoAux.nome,
                grupoAnexoItemID: itemAnexoAux.grupoanexoitemID,
                arquivo: selectedFile,
                usuarioID: user.usuarioID,
                recebimentoMpID: '',
                naoConformidadeID: '',
                file: {
                    status: true,
                    name: selectedFile?.name,
                    size: selectedFile?.size,
                    type: selectedFile?.type
                }
            }
            setArrAnexo([...arrAnexo, newAnexo])
            arrAnexoRemoved.splice(arrAnexoRemoved.indexOf(existingAnexo), 1)
        }
    }

    // Envia os arquivos de anexo para o backend
    const enviarPDFsParaBackend = async () => {
        const formData = new FormData()

        if (arrAnexo.length === 0) {
            toast.error('Selecione ao menos um arquivo para enviar!')
            return
        }

        arrAnexo.forEach((file, index) => {
            formData.append(`pdfFiles`, file.arquivo)
            formData.append(`titulo`, file.titulo)
            formData.append(`tamanho`, file.file.size)
            formData.append(`grupoAnexoItemID`, file.grupoAnexoItemID)
            formData.append(`usuarioID`, file.usuarioID)
            formData.append(`recebimentoMpID`, file.recebimentoMpID)
            formData.append(`naoConformidadeID`, file.naoConformidadeID)
            formData.append(`unidadeID`, loggedUnity.unidadeID)
            formData.append(`arrAnexoRemoved`, arrAnexoRemoved)
        })

        await api
            .post(`/formularios/fornecedor/saveAnexo/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                if (response.status === 200) {
                    toast.success('Anexos enviados com sucesso!')
                    setArrAnexo([])
                    setItemAnexoAux({})
                    setLoadingSave(!isLoadingSave)
                }
            })
    }

    // Remove um anexo do array de anexos
    const handleRemoveAnexo = item => {
        const updatedArrAnexo = arrAnexo.filter(anexo => anexo.grupoAnexoItemID !== item)
        setArrAnexo(updatedArrAnexo)
        setArrAnexoRemoved([...arrAnexoRemoved, item])
    }

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : fieldsState ? (
                <form
                    onSubmit={handleSubmit(data => {
                        canEdit.status ? onSubmit(data, false) : updateFormStatus()
                    })}
                >
                    {/* Mensagem de que não possui nenhum bloco */}
                    {blocks && blocks.length === 0 && (
                        <Alert severity='warning' sx={{ mb: 2 }}>
                            Não há nenhum bloco disponível para as categorias selecionadas!
                        </Alert>
                    )}
                    {!canEdit.status && (
                        <Alert severity={canEdit.messageType} sx={{ mb: 2 }}>
                            {canEdit.message}
                        </Alert>
                    )}

                    {/* Card Header */}
                    <Card>
                        <FormHeader
                            btnCancel
                            btnSave={user.papelID == 2 && info.status < 40}
                            btnSend={
                                (user.papelID == 1 && info.status >= 40) || (user.papelID == 2 && info.status < 40)
                            }
                            disabledSend={blocks.length === 0 ? true : false}
                            disabledSubmit={blocks.length === 0 ? true : false}
                            disabledPrint={blocks.length === 0 ? true : false}
                            btnPrint
                            generateReport={generateReport}
                            dataReports={dataReports}
                            handleSubmit={() => handleSubmit(onSubmit)}
                            handleSend={handleSendForm}
                            title='Fornecedor'
                            btnStatus
                            handleBtnStatus={() => setOpenModalStatus(true)}
                        />

                        <CardContent>
                            {unidade && (
                                <Box sx={{ mb: 4 }}>
                                    <input
                                        type='hidden'
                                        value={unidade.unidadeID}
                                        name='unidadeID'
                                        {...register(`unidadeID`)}
                                    />

                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant='caption'>Fábrica:</Typography>
                                            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                {unidade.nomeFantasia}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            {status && (
                                                <Box display='flex' alignItems='center' justifyContent='flex-end'>
                                                    <CustomChip
                                                        size='small'
                                                        skin='light'
                                                        color={status.color}
                                                        label={status.title}
                                                        sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
                                                    />
                                                </Box>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Header */}
                            <Fields
                                register={register}
                                errors={errors}
                                setValue={setValue}
                                watch={watch}
                                fields={fieldsState}
                                values={data}
                                isDisabled={!canEdit.status}
                                setCopiedDataContext={setCopiedDataContext}
                            />

                            {/* Categorias, Atividades e Sistemas de Qualidade */}
                            <Grid container spacing={4}>
                                {/* Categorias */}
                                <Grid item xs={12} md={4}>
                                    <CheckList
                                        title='Categorias'
                                        values={categorias}
                                        name='categorias'
                                        changeCategory={changeCategory}
                                        register={register}
                                        isDisabled={!canEdit.status}
                                    />
                                </Grid>

                                {/* Atividades */}
                                <Grid item xs={12} md={4}>
                                    <CheckList
                                        title='Atividades'
                                        values={atividades}
                                        name='atividades'
                                        register={register}
                                        isDisabled={!canEdit.status}
                                    />
                                </Grid>

                                {/* Sistemas de Qualidade */}
                                <Grid item xs={12} md={4}>
                                    <CheckList
                                        title='Sistema de Qualidade'
                                        values={sistemasQualidade}
                                        name='sistemasQualidade'
                                        register={register}
                                        isDisabled={!canEdit.status}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Blocos */}
                    {blocks &&
                        blocks.map((bloco, indexBloco) => (
                            <Block
                                key={indexBloco}
                                index={indexBloco}
                                blockKey={`parFornecedorBlocoID`}
                                values={bloco}
                                register={register}
                                setValue={setValue}
                                errors={errors}
                                isDisabled={!canEdit.status}
                            />
                        ))}

                    {/* Grupo de anexos */}
                    {grupoAnexo && (
                        <>
                            {grupoAnexo.map((grupo, indexGrupo) => (
                                <Card key={indexGrupo} sx={{ mt: 4 }}>
                                    <CardContent>
                                        {/* {JSON.stringify(arrAnexo)} */}
                                        <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                                            {grupo.nome}
                                        </Typography>
                                        <Typography variant='body2' sx={{ mb: 2 }}>
                                            {grupo.descricao}
                                        </Typography>
                                        {/* Itens do grupo */}
                                        <Grid container spacing={4}>
                                            {grupo.itens.map((item, indexItem) => (
                                                <Grid item xs={12} md={4} key={`${indexGrupo}-${indexItem}`}>
                                                    <Box
                                                        style={{
                                                            border: `${
                                                                mode == 'dark'
                                                                    ? '1px solid rgba(234, 234, 255, 0.10)'
                                                                    : '1px solid rgba(76, 78, 100, 0.12)'
                                                            }`,
                                                            borderRadius: '12px',
                                                            padding: '25px',
                                                            paddingTop: '120px',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '6px',
                                                            position: 'relative',
                                                            zIndex: 10
                                                        }}
                                                    >
                                                        <div
                                                            onClick={() => handleAvatarClick(item)}
                                                            className='cursor-pointer '
                                                        >
                                                            <img
                                                                src='/images/storyset/a.svg'
                                                                alt=''
                                                                className='w-[20%] top-8 left-0 absolute'
                                                            />
                                                            <div>
                                                                <Typography
                                                                    variant='subtitle1'
                                                                    sx={{ fontWeight: 600, mb: 2 }}
                                                                >
                                                                    {item.nome}
                                                                </Typography>
                                                                <Typography variant='body2' sx={{ mb: 2 }}>
                                                                    {item.descricao}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                        {(() => {
                                                            const foundAnexo = arrAnexo.find(
                                                                anexo => item.grupoanexoitemID == anexo.grupoAnexoItemID
                                                            )
                                                            if (foundAnexo) {
                                                                return (
                                                                    <div
                                                                        className={`flex p-2 items-center justify-between gap-2 rounded-lg `}
                                                                        style={{
                                                                            border: `${
                                                                                mode == 'dark'
                                                                                    ? '1px dashed rgba(234, 234, 255, 0.10)'
                                                                                    : '1px dashed rgba(76, 78, 100, 0.12)'
                                                                            }`
                                                                        }}
                                                                    >
                                                                        <div className='flex gap-2 items-center'>
                                                                            <img
                                                                                width={28}
                                                                                height={28}
                                                                                alt='invoice.pdf'
                                                                                src='/images/icons/file-icons/pdf.png'
                                                                            />
                                                                            <Typography variant='body2'>{`${
                                                                                foundAnexo?.file?.name
                                                                            } (${(
                                                                                foundAnexo?.file?.size /
                                                                                1024 /
                                                                                1024
                                                                            ).toFixed(2)}mb)`}</Typography>
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                zIndex: 9999
                                                                            }}
                                                                        >
                                                                            <Button
                                                                                variant='outlined'
                                                                                size='small'
                                                                                onClick={() =>
                                                                                    handleRemoveAnexo(
                                                                                        foundAnexo.grupoAnexoItemID
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remover
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                            return null
                                                        })()}
                                                        <input
                                                            type='file'
                                                            ref={fileInputRef}
                                                            style={{ display: 'none' }}
                                                            onChange={handleFileSelect}
                                                        />
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                            <Button variant='contained' onClick={enviarPDFsParaBackend}>
                                Enviar Anexos
                            </Button>
                        </>
                    )}

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
                                            disabled={!canEdit.status}
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
                </form>
            ) : null}

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
            {/* <DialogForm
                openModal={openModal}
                handleClose={() => setOpenModal(false)}
                title='Concluir e Enviar Formulário'
                text={`Deseja realmente concluir e enviar? Após a conclusão, você não poderá mais alterar esse formulário. Um e-mail será enviado e agora basta aguardar a análise do ${unidade?.nomeFantasia}. Após a conclusão você será alertado no email ${user.email}`}
                btnCancel
                btnConfirm
                btnConfirmColor='primary'
                handleSubmit={conclusionAndSendForm}
            /> */}

            {/* Dialog pra alterar status do formulário (se formulário estiver concluído e fábrica queira reabrir pro preenchimento do fornecedor) */}
            {openModalStatus && (
                <DialogFormStatus
                    id={id}
                    parFormularioID={1} // Fornecedor
                    formStatus={info.status}
                    hasFormPending={hasFormPending}
                    canChangeStatus={user.papelID == 1 && !hasFormPending && info.status > 30}
                    openModal={openModalStatus}
                    handleClose={() => setOpenModalStatus(false)}
                    title='Histórico do Formulário'
                    text={`Listagem do histórico das movimentações do formulário ${id} do Fornecedor.`}
                    btnCancel
                    btnConfirm
                    handleSubmit={changeFormStatus}
                />
            )}
        </>
    )
}

export default FormFornecedor

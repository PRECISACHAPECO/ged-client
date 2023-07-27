// import * as React from 'react'
import { useState, useEffect, useContext, useRef, use } from 'react'
import { useForm, Controller } from 'react-hook-form'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import upload from 'src/icon/Upload'

//* Default Form Components
import Fields from 'src/components/Defaults/Formularios/Fields'
import Input from 'src/components/Form/Input'
import CheckList from 'src/components/Defaults/Formularios/CheckList'
import Block from 'src/components/Defaults/Formularios/Block'
import CardAnexo from 'src/components/Anexos/CardAnexo'

import ReportFornecedor from 'src/components/Reports/Formularios/Fornecedor'

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
import { backRoute } from 'src/configs/defaultConfigs'
import { api } from 'src/configs/api'
import FormHeader from 'src/components/Defaults/FormHeader'
import { ParametersContext } from 'src/context/ParametersContext'
import { RouteContext } from 'src/context/RouteContext'
import { AuthContext } from 'src/context/AuthContext'
import Loading from 'src/components/Loading'
import { toastMessage, formType, statusDefault, dateConfig } from 'src/configs/defaultConfigs'
import { formatDate } from 'src/configs/conversions'
import toast from 'react-hot-toast'
import { Checkbox } from '@mui/material'
import { SettingsContext } from 'src/@core/context/settingsContext'
import { cnpjMask, cellPhoneMask, cepMask, ufMask } from 'src/configs/masks'
import DialogFormConclusion from '../Defaults/Dialogs/DialogFormConclusion'
import ReportFornecedor from 'src/components/Reports/Formularios/Fornecedor'

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

const FormFornecedor = ({ id }) => {
    const { user, loggedUnity } = useContext(AuthContext)
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
    const [listErrors, setListErrors] = useState({ status: false, errors: [] })
    const [copiedDataContext, setCopiedDataContext] = useState(false)
    const [arrAnexoRemoved, setArrAnexoRemoved] = useState([])

    const [canEdit, setCanEdit] = useState({
        status: false,
        message: 'Você não tem permissões',
        messageType: 'info'
    })

    //! Se perder Id, copia do localstorage
    const { setTitle, setStorageId, getStorageId } = useContext(ParametersContext)
    const router = Router
    const { setId } = useContext(RouteContext)
    // if (!id) id = getStorageId()
    // useEffect(() => {
    //     setStorageId(id)
    // }, [])

    const type = id && id > 0 ? 'edit' : 'new'
    const staticUrl = router.pathname

    const { settings } = useContext(SettingsContext)

    const {
        watch,
        register,
        reset,
        control,
        getValues,
        clearErrors,
        setValue,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm()

    // const initializeValues = values => {
    //     // Seta itens no formulário
    //     values?.blocos?.map((block, indexBlock) => {
    //         block?.itens?.map((item, indexItem) => {
    //             if (item?.resposta) {
    //                 setValue(`blocos[${indexBlock}].itens[${indexItem}].resposta`, item?.resposta)
    //             }
    //         })
    //     })
    //     setValue()
    // }

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
            title: 'Formulário do fornecedor',
            titleButton: 'Imprimir',
            component: <ReportFornecedor params={{ id: id }} />,
            route: '/relatorio/fornecedor/dadosFornecedor',
            papelID: user.papelID,
            identification: '01',
            params: {
                fornecedorID: id
            }
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
                api.post(`${staticUrl}/getData/${id}`, { unidadeLogadaID: loggedUnity.unidadeID }).then(response => {
                    console.log('getData: ', response.data)

                    setFields(response.data.fields)
                    setCategorias(response.data.categorias)
                    setAtividades(response.data.atividades)
                    setSistemasQualidade(response.data.sistemasQualidade)

                    setAllBlocks(response.data.blocos)
                    setVisibleBlocks(response.data.blocos, response.data.categorias)

                    // setData(response.data.data)
                    setGrupoAnexo(response.data.grupoAnexo)

                    setInfo(response.data.info)
                    setUnidade(response.data.unidade)

                    // initializeValues(response.data)
                    //* Insere os dados no formulário
                    reset(response.data)

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
            form: values,
            auth: {
                usuarioID: user.usuarioID,
                papelID: user.papelID,
                unidadeID: loggedUnity.unidadeID
            }
        }
        console.log('🚀 ~ onSubmit:', data.form)
        // return

        try {
            setLoadingSave(true)
            await enviarPDFsParaBackend()
            await api.put(`${staticUrl}/updateData/${id}`, data).then(response => {
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
    }, [id, isLoadingSave])

    useEffect(() => {
        checkErrors()
    }, [])

    // Mostra toast se o formulário foi copiado de "MEUS DADOS"
    useEffect(() => {
        if (copiedDataContext) {
            toast.success('Dados copiados com sucesso!')
        }
    }, [copiedDataContext])

    // Quando selecionar um arquivo, o arquivo é adicionado ao array de anexos
    const handleFileSelect = (event, item) => {
        const selectedFile = event.target.files[0]
        console.log('🚀 ~ selectedFile:', selectedFile)

        // Atualiza o objeto anexo com o arquivo selecionado
        const updatedItem = {
            ...item,
            anexo: {
                exist: true,
                path: null,
                file: selectedFile,
                nome: selectedFile.name,
                type: selectedFile.type,
                size: selectedFile.size,
                time: selectedFile.lastModified
            }
        }

        // Atualiza estado grupoAnexo com o item atualizado
        const updatedGrupoAnexo = grupoAnexo.map(grupo => {
            if (grupo.grupoAnexoID == item.grupoanexoID) {
                return {
                    ...grupo,
                    itens: grupo.itens.map(item => {
                        if (item.grupoanexoitemID == updatedItem.grupoanexoitemID) {
                            console.log('encontrou item')
                            return updatedItem
                        }
                        return item
                    })
                }
            }
            return grupo
        })
        setGrupoAnexo(updatedGrupoAnexo)

        toast.success('Anexo adicionado, salve para concluir!')
    }

    // Envia os arquivos de anexo para o backend
    const enviarPDFsParaBackend = async () => {
        const formData = new FormData()

        formData.append(`usuarioID`, user.usuarioID)
        formData.append(`unidadeID`, loggedUnity.unidadeID)

        let index = 0
        grupoAnexo.forEach((grupo, grupoIndex) => {
            // grupo
            grupo.itens.forEach((item, itemIndex) => {
                // itens
                if (item.anexo && item.anexo.file) {
                    formData.append(`pdfFiles`, item.anexo.file)
                    formData.append(`titulo[${index}]`, item.anexo.nome)
                    formData.append(`grupoanexoitemID[${index}]`, item.grupoanexoitemID)
                    //
                    index++
                }
            })
        })

        //? Envia array de anexos a serem removidos
        arrAnexoRemoved.forEach((item, index) => {
            formData.append(`arrAnexoRemoved[${index}]`, item)
        })

        await api.post(`/formularios/fornecedor/saveAnexo/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    // Remove um anexo do array de anexos
    const handleRemoveAnexo = item => {
        // Array que envia pro backend deletar
        setArrAnexoRemoved([...arrAnexoRemoved, item.grupoanexoitemID])

        // Atualiza estado com setGrupoAnexo, removendo objeto de anexo
        const updatedGrupoAnexo = grupoAnexo.map(grupo => {
            if (grupo.grupoAnexoID == item.grupoanexoID) {
                return {
                    ...grupo,
                    itens: grupo.itens.map(row => {
                        if (row.grupoanexoitemID == item.grupoanexoitemID) {
                            return {
                                ...item,
                                anexo: null
                            }
                        }
                        return row
                    })
                }
            }
            return grupo
        })
        setGrupoAnexo(updatedGrupoAnexo)

        toast.success('Anexo pré-removido, salve para concluir!')
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
                            dataReports={dataReports}
                            handleSubmit={() => handleSubmit(onSubmit)}
                            handleSend={handleSendForm}
                            title='Fornecedor'
                            btnStatus
                            handleBtnStatus={() => setOpenModalStatus(true)}
                            type={type}
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
                                fields={fieldsState}
                                register={register}
                                errors={errors}
                                setValue={setValue}
                                control={control}
                                watch={watch}
                                disabled={!canEdit.status}
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
                                        disabled={!canEdit.status}
                                    />
                                </Grid>

                                {/* Atividades */}
                                <Grid item xs={12} md={4}>
                                    <CheckList
                                        title='Atividades'
                                        values={atividades}
                                        name='atividades'
                                        register={register}
                                        disabled={!canEdit.status}
                                    />
                                </Grid>

                                {/* Sistemas de Qualidade */}
                                <Grid item xs={12} md={4}>
                                    <CheckList
                                        title='Sistema de Qualidade'
                                        values={sistemasQualidade}
                                        name='sistemasQualidade'
                                        register={register}
                                        disabled={!canEdit.status}
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
                                control={control}
                                register={register}
                                setValue={setValue}
                                errors={errors}
                                disabled={!canEdit.status}
                            />
                        ))}

                    {/* Grupo de anexos */}
                    {grupoAnexo &&
                        grupoAnexo.map((grupo, indexGrupo) => (
                            <CardAnexo
                                key={indexGrupo}
                                grupo={grupo}
                                indexGrupo={indexGrupo}
                                handleFileSelect={handleFileSelect}
                                handleRemoveAnexo={handleRemoveAnexo}
                            />
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
                                        {/* <Input
                                            title='Observação (opcional)'
                                            name='obs'
                                            multiline
                                            rows={4}
                                            value={info.obs}
                                            disabled={!canEdit.status}
                                            register={register}
                                        /> */}
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

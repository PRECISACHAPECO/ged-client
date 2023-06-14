// import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

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

    const initializeValues = values => {
        // Seta itens no formulário
        values.blocos.map((block, indexBlock) => {
            block.itens.map((item, indexItem) => {
                console.log('🚀 ~ item:', item)
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
            papelID: user.papelID,
            identification: '01',
            params: {
                fornecedorID: id
            }
        },
        {
            id: 2,
            name: 'Recepção',
            component: 'Fornecedor',
            papelID: user.papelID,
            identification: '02'
        }
    ]

    const setVisibleBlocks = (blocks, categorias) => {
        let arrVisibleBlocks = []

        blocks.map((block, index) => {
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
            api.get(`${staticUrl}/${id}`).then(response => {
                // console.log('getData: ', response.data)

                setFields(response.data.fields)
                setCategorias(response.data.categorias)
                setAtividades(response.data.atividades)
                setSistemasQualidade(response.data.sistemasQualidade)

                setAllBlocks(response.data.blocos)
                setVisibleBlocks(response.data.blocos, response.data.categorias)

                setData(response.data.data)
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
        console.log('🚀 ~ conclusionForm: ', values)

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

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : data ? (
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

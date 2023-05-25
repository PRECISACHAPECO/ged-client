// import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

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
import { toastMessage, formType, statusDefault } from 'src/configs/defaultConfigs'
import toast from 'react-hot-toast'
import { Checkbox } from '@mui/material'
import { SettingsContext } from 'src/@core/context/settingsContext'
import { cnpjMask, cellPhoneMask, cepMask, ufMask } from 'src/configs/masks'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// Date
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br' // import locale
import DialogForm from '../Defaults/Dialogs/Dialog'
import DialogChangeFormStatus from '../Defaults/Dialogs/DialogChangeFormStatus'

const FormFornecedor = () => {
    const { user, loggedUnity } = useContext(AuthContext)
    const { setTitle } = useContext(ParametersContext)
    const [isLoading, setLoading] = useState(false) //? loading de carregamento da página
    const [isLoadingSave, setLoadingSave] = useState(false) //? dependencia do useEffect pra atualizar a página após salvar

    const [fields, setFields] = useState([])
    const [data, setData] = useState(null)
    const [atividades, setAtividades] = useState([])
    const [sistemasQualidade, setSistemasQualidade] = useState([])
    const [blocos, setBlocos] = useState([])
    const [info, setInfo] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [unidade, setUnidade] = useState(null)
    const [status, setStatus] = useState(null)
    const [statusEdit, setStatusEdit] = useState(false)
    const [openModalStatus, setOpenModalStatus] = useState(false)
    const [hasFormPending, setHasFormPending] = useState(true) //? Tem pendencia no formulário (já vinculado em formulário de recebimento, não altera mais o status)
    const [watchRegistroEstabelecimento, setWatchRegistroEstabelecimento] = useState(null)

    const [canEdit, setCanEdit] = useState({
        status: false,
        message: 'Voce nao tem permissoes mais garoto...',
        messageType: 'info'
    })

    const router = Router
    const { id } = router.query
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const type = formType(router.pathname) // Verifica se é novo ou edição

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
        formState: { errors }
    } = useForm()

    console.log('errors: ', errors)

    console.log('controlRegistroEstabelecimento > watchRegistroEstabelecimento > ', watchRegistroEstabelecimento)

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
    const reOpenFormStatus = async status => {
        console.log('reOpenFormStatus: ', status)
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
            await api.post(`${staticUrl}/reOpenFormStatus/${id}`, data).then(response => {
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
            console.log('updateFormStatus: ', data)
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
    const conclusionAndSendForm = async () => {
        const data = {
            usuarioID: user.usuarioID,
            unidadeID: loggedUnity.unidadeID,
            papelID: user.papelID
        }
        try {
            setLoadingSave(true)
            await api.post(`${staticUrl}/conclusionAndSendForm/${id}`, data).then(response => {
                if (response.status === 201) {
                    toast.error(`Erro ao concluir o formulário!`)
                } else if (response.status === 202) {
                    toast.error(`Erro ao realizar o envio de email para ${user.email}`)
                    toast.success(`Formulário concluído com sucesso!`)
                    getData()
                } else {
                    toast.success(`Formulário concluído com sucesso!`)
                }
                setOpenModal(false)
                setLoadingSave(false)
            })
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

    // Nomes e rotas dos relatórios passados para o componente FormHeader/MenuReports
    const dataReports = [
        {
            id: 1,
            name: 'Fornecedor',
            identification: '01',
            route: 'relatorio/fornecedor',
            params: {
                fornecedorID: id,
                unidadeID: loggedUnity.unidadeID
            }
        },
        {
            id: 2,
            name: 'Recepção',
            identification: '02',
            route: '/relatorio/recepcao'
        },
        {
            id: 3,
            name: 'Ficha de Matrícula',
            identification: '03',
            route: '/'
        },
        {
            id: 4,
            name: 'Ficha de Nacionalidade',
            identification: '04',
            route: '/'
        }
    ]

    const getData = () => {
        try {
            setLoading(true)
            api.get(`${staticUrl}/${id}`).then(response => {
                console.log('getData: ', response.data)

                setFields(response.data.fields)
                setAtividades(response.data.atividades)
                setSistemasQualidade(response.data.sistemasQualidade)
                setBlocos(response.data.blocos)

                setData(response.data.data)
                setInfo(response.data.info)
                setUnidade(response.data.unidade)

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

                setWatchRegistroEstabelecimento(response.data.data?.registroestabelecimento)

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

    const handleSendForm = async () => {
        console.log('handleSendForm.....')
        handleSubmit(onSubmit)(true)
    }

    const onSubmit = async (data, canOpenModal) => {
        if (canOpenModal) {
            submitData(data)
            setOpenModal(true) // abre modal
        } else {
            submitData(data)
            setOpenModal(false)
        }
    }

    const submitData = async values => {
        console.log('submitData')
        const data = {
            forms: values,
            auth: {
                usuarioID: user.usuarioID,
                papelID: user.papelID,
                unidadeID: loggedUnity.unidadeID
            }
        }

        console.log('submit data: ', data)
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

    useEffect(() => {
        setTitle('Formulário do Fornecedor')
        //? Form Fornecedor não tem página NOVO
        type == 'edit' ? getData() : noPermissions()
        verifyFormPending()
    }, [isLoadingSave])

    return (
        <>
            {isLoading && <Loading />}
            {data && (
                <form
                    onSubmit={handleSubmit(data => {
                        canEdit.status ? onSubmit(data, false) : updateFormStatus()
                    })}
                >
                    {/* Card Header */}
                    <Card>
                        <FormHeader
                            btnCancel
                            btnChangeStatus
                            btnSave={canEdit.status || (user.papelID == 1 && info.status >= 40)}
                            btnSend={user.papelID == 2 && info.status < 40 ? true : false}
                            btnPrint
                            generateReport={generateReport}
                            dataReports={dataReports}
                            handleSubmit={e => handleSubmit(onSubmit)}
                            handleSend={handleSendForm}
                            handleChangeStatus={() => setOpenModalStatus(true)}
                            title='Fornecedor'
                        />
                        <CardContent>
                            {!canEdit.status && (
                                <Alert severity={canEdit.messageType} sx={{ mb: 4 }}>
                                    {canEdit.message}
                                </Alert>
                            )}
                            {unidade && (
                                <>
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
                                </>
                            )}

                            {/* Header */}
                            <Grid container spacing={4} sx={{ mt: 4 }}>
                                {fields &&
                                    fields.map((field, index) => (
                                        <Grid key={index} item xs={12} md={3}>
                                            <FormControl fullWidth>
                                                {/* int (select) */}
                                                {field && field.tipo === 'int' && field.tabela && (
                                                    <Autocomplete
                                                        disabled={!canEdit.status}
                                                        options={field.options}
                                                        getOptionSelected={(option, value) => option.id === value.id}
                                                        defaultValue={
                                                            defaultValues?.[field.tabela]?.id
                                                                ? defaultValues[field.tabela]
                                                                : null
                                                        }
                                                        getOptionLabel={option => option.nome}
                                                        name={`header.${field.tabela}`}
                                                        {...register(`header.${field.tabela}`, {
                                                            required: !!field.obrigatorio
                                                        })}
                                                        onChange={(event, newValue) => {
                                                            setValue(`header.${field.tabela}`, newValue ? newValue : '')
                                                            field.tabela == 'registroestabelecimento'
                                                                ? setWatchRegistroEstabelecimento(
                                                                      watch('header.registroestabelecimento')
                                                                  )
                                                                : null
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
                                                            disabled={!canEdit.status}
                                                            locale={dayjs.locale('pt-br')}
                                                            format='DD/MM/YYYY'
                                                            defaultValue={dayjs(new Date())}
                                                            renderInput={params => (
                                                                <TextField
                                                                    {...params}
                                                                    variant='outlined'
                                                                    name={`header.${field.nomeColuna}`}
                                                                    {...register(`header.${field.nomeColuna}`, {
                                                                        required: !!field.obrigatorio && canEdit.status
                                                                    })}
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                )}
                                                {/* Textfield */}
                                                {/* Nº Registro, só mostra se registro do estabelecimento for MAPA ou ANVISA */}
                                                {field &&
                                                    field.tipo == 'string' &&
                                                    (field.nomeColuna != 'numeroRegistro' ||
                                                        watchRegistroEstabelecimento?.id > 1) && (
                                                        <TextField
                                                            defaultValue={
                                                                defaultValues ? defaultValues[field.nomeColuna] : ''
                                                            }
                                                            label={field.nomeCampo}
                                                            disabled={!canEdit.status}
                                                            placeholder={field.nomeCampo}
                                                            name={`header.${field.nomeColuna}`}
                                                            aria-describedby='validation-schema-nome'
                                                            error={errors?.header?.[field.nomeColuna] ? true : false}
                                                            {...register(`header.${field.nomeColuna}`, {
                                                                required: !!field.obrigatorio && canEdit.status
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
                                    ))}
                            </Grid>

                            {/* Atividades e Sistemas de Qualidade */}
                            <Grid container spacing={4}>
                                {/* Atividades */}
                                <Grid item xs={12} md={4}>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                Atividades
                                            </Typography>
                                        </ListItemButton>
                                    </ListItem>
                                    {atividades &&
                                        atividades.map((atividade, indexAtividade) => (
                                            <ListItem key={indexAtividade} disablePadding>
                                                <ListItemButton>
                                                    <input
                                                        type='hidden'
                                                        name={`atividades.[${indexAtividade}].atividadeID`}
                                                        defaultValue={atividade.atividadeID}
                                                        {...register(`atividades.[${indexAtividade}].atividadeID`)}
                                                    />

                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                name={`atividades[${indexAtividade}].checked`}
                                                                disabled={!canEdit.status}
                                                                {...register(`atividades[${indexAtividade}].checked`)}
                                                                defaultChecked={atividade.checked == 1 ? true : false}
                                                            />
                                                        }
                                                        label={atividade.nome}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                </Grid>

                                {/* Sistemas de Qualidade */}
                                <Grid item xs={12} md={4}>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                Sistemas de Qualidade
                                            </Typography>
                                        </ListItemButton>
                                    </ListItem>
                                    {sistemasQualidade &&
                                        sistemasQualidade.map((sistemaQualidade, indexSistemaQualidade) => (
                                            <ListItem key={indexSistemaQualidade} disablePadding>
                                                <ListItemButton>
                                                    <input
                                                        type='hidden'
                                                        name={`sistemasQualidade.[${indexSistemaQualidade}].sistemaQualidadeID`}
                                                        defaultValue={sistemaQualidade.sistemaQualidadeID}
                                                        {...register(
                                                            `sistemasQualidade.[${indexSistemaQualidade}].sistemaQualidadeID`
                                                        )}
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                name={`sistemasQualidade[${indexSistemaQualidade}].checked`}
                                                                disabled={!canEdit.status}
                                                                {...register(
                                                                    `sistemasQualidade[${indexSistemaQualidade}].checked`
                                                                )}
                                                                defaultChecked={
                                                                    sistemaQualidade.checked == 1 ? true : false
                                                                }
                                                            />
                                                        }
                                                        label={sistemaQualidade.nome}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Blocos */}
                    {blocos &&
                        blocos.map((bloco, indexBloco) => (
                            <Card key={indexBloco} sx={{ mt: 4 }}>
                                <CardContent>
                                    <Grid container>
                                        {/* Hidden do parFornecedorBlocoID */}
                                        <input
                                            type='hidden'
                                            name={`blocos[${indexBloco}].parFornecedorBlocoID`}
                                            defaultValue={bloco.parFornecedorBlocoID}
                                            {...register(`blocos[${indexBloco}].parFornecedorBlocoID`)}
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
                                                                    color: item.resposta ? 'green' : 'gray',
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
                                                                        disabled={!canEdit.status}
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
                                                                        <LocalizationProvider
                                                                            dateAdapter={AdapterDayjs}
                                                                        >
                                                                            <DatePicker
                                                                                label='Selecione uma data'
                                                                                locale={dayjs.locale('pt-br')}
                                                                                format='DD/MM/YYYY'
                                                                                disabled={!canEdit.status}
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
                                                                            disabled={!canEdit.status}
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
                                                                        disabled={!canEdit.status}
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

                    {/* Status que a fábrica irá setar (aprovado, aprovado parcial ou reprovado) */}
                    {user && user.papelID == 1 && info.status >= 40 && (
                        <Card sx={{ mt: 4 }}>
                            <CardContent>
                                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                                    Status do Formulário
                                </Typography>
                                {/* Mensagem que não pode mais alterar pq já foi usado */}
                                {hasFormPending && (
                                    <Alert severity='warning' sx={{ mb: 4 }}>
                                        O Status não pode mais ser alterado pois já está sendo utilizado em outro
                                        formulário!
                                    </Alert>
                                )}
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
                                            disabled={hasFormPending}
                                            name={`status`}
                                            {...register(`status`)}
                                            onChange={() => setStatusEdit(true)}
                                            control={<Radio color='success' />}
                                            label='Aprovado'
                                        />
                                        <FormControlLabel
                                            value={60}
                                            disabled={hasFormPending}
                                            name={`status`}
                                            {...register(`status`)}
                                            onChange={() => setStatusEdit(true)}
                                            label='Aprovado parcial'
                                            control={<Radio color='warning' />}
                                        />
                                        <FormControlLabel
                                            value={50}
                                            disabled={hasFormPending}
                                            name={`status`}
                                            {...register(`status`)}
                                            onChange={() => setStatusEdit(true)}
                                            label='Reprovado'
                                            control={<Radio color='error' />}
                                        />
                                    </RadioGroup>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </form>
            )}

            {/* Dialog de confirmação de envio */}
            <DialogForm
                openModal={openModal}
                handleClose={() => setOpenModal(false)}
                title='Concluir e Enviar Formulário'
                text={`Deseja realmente concluir e enviar? Após a conclusão, você não poderá mais alterar esse formulário. Um e-mail será enviado e agora basta aguardar a análise do ${unidade?.nomeFantasia}. Após a conclusão você será alertado no email ${user.email}`}
                btnCancel
                btnConfirm
                btnConfirmColor='primary'
                handleSubmit={conclusionAndSendForm}
            />

            {/* Dialog pra alterar status do formulário (se formulário estiver concluído e fábrica queira reabrir pro preenchimento do fornecedor) */}
            {openModalStatus && (
                <DialogChangeFormStatus
                    id={id}
                    parFormularioID={1} // Fornecedor
                    formStatus={info.status}
                    hasFormPending={hasFormPending}
                    openModal={openModalStatus}
                    handleClose={() => setOpenModalStatus(false)}
                    title='Histórico do Formulário'
                    text={`Listagem do histórico das movimentações do formulário ${id} do Fornecedor.`}
                    btnCancel
                    btnConfirm
                    handleSubmit={reOpenFormStatus}
                />
            )}
        </>
    )
}

export default FormFornecedor

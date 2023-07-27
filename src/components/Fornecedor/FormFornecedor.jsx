// import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

import ReportFornecedor from 'src/components/Reports/Formularios/Fornecedor'

import {
    Autocomplete,
    Box,
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

const FormFornecedor = ({ id }) => {
    const { user, loggedUnity } = useContext(AuthContext)
    const { setTitle } = useContext(ParametersContext)
    const [isLoading, setLoading] = useState(true)

    const [fields, setFields] = useState([])
    const [data, setData] = useState(null)
    const [atividades, setAtividades] = useState([])
    const [sistemasQualidade, setSistemasQualidade] = useState([])
    const [blocos, setBlocos] = useState([])
    const [info, setInfo] = useState('')

    const router = Router
<<<<<<< HEAD
    const { setId } = useContext(RouteContext)
    // if (!id) id = getStorageId()
    // useEffect(() => {
    //     setStorageId(id)
    // }, [])

    const type = id && id > 0 ? 'edit' : 'new'
    const staticUrl = router.pathname
=======
    const { id } = router.query
    const staticUrl = backRoute(router.pathname) // Url sem ID
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b

    const { settings } = useContext(SettingsContext)
    const mode = settings.mode

    // criar validação DINAMICA com reduce no Yup, varrendo campos fields e validando os valores vindos em defaultValues
    const defaultValues =
        data &&
        fields.reduce((defaultValues, field) => {
            defaultValues[field.nomeColuna] = data[field.nomeColuna]
            return defaultValues
        }, {})

    const {
        register,
        reset,
        control,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm()

<<<<<<< HEAD
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
=======
    console.log('errors: ', errors)
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b

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

    // Nomes e rotas dos relatórios passados para o componente FormHeader/MenuReports
    const dataReports = [
        {
            id: 1,
<<<<<<< HEAD
            title: 'Formulário do fornecedor',
            titleButton: 'Imprimir',
            component: <ReportFornecedor params={{ id: id }} />,
            route: '/relatorio/fornecedor/dadosFornecedor',
            papelID: user.papelID,
=======
            name: 'Fornecedor',
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
            identification: '01',
            route: 'relatorio/fornecedor',
            params: {
                fornecedorID: id,
                unidadeID: loggedUnity.unidadeID
            }
<<<<<<< HEAD
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
=======
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

    useEffect(() => {
        setTitle('Formulário do Fornecedor')
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b

        const getData = () => {
            api.get(`${staticUrl}/${loggedUnity.unidadeID}`, { headers: { 'function-name': 'getData' } }).then(
                response => {
                    console.log('getData: ', response.data)
                    setFields(response.data.fields)
                    setData(response.data.data)
                    setAtividades(response.data.atividades)
                    setSistemasQualidade(response.data.sistemasQualidade)
                    setBlocos(response.data.blocos)
                    setInfo(response.data.info)
                    setLoading(false)
                }
            )
        }
        getData()
    }, [onSubmit])

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
                            dataReports={dataReports}
                            handleSubmit={() => handleSubmit(onSubmit)}
                            title='Fornecedor'
<<<<<<< HEAD
                            btnStatus
                            handleBtnStatus={() => setOpenModalStatus(true)}
                            type={type}
=======
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
                        />
                        <CardContent>
                            {/* Header */}
<<<<<<< HEAD
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
=======
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b
                            <Grid container spacing={4}>
                                {fields &&
                                    fields.map((field, index) => (
                                        <Grid key={index} item xs={12} md={3}>
                                            <FormControl fullWidth>
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
                                                                        required: !!field.obrigatorio
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
<<<<<<< HEAD
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
=======
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
>>>>>>> afef836c6b2da3ee5ba0e1f1b1b30329afc2227b

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
                </form>
            )}
        </>
    )
}

export default FormFornecedor

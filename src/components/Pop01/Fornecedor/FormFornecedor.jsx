// import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'

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
import FormHeader from 'src/components/FormHeader'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import { Loading } from 'src/components/Loading'
import { toastMessage } from 'src/configs/defaultConfigs'
import toast from 'react-hot-toast'
import { Checkbox } from '@mui/material'
import { SettingsContext } from 'src/@core/context/settingsContext'

// Date
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br' // import locale
import MenuReports from 'src/components/MenuReports'
import axios from 'axios'

const FormFornecedor = () => {
    const { user } = useContext(AuthContext)
    const { setTitle } = useContext(ParametersContext)
    const [loading, setLoading] = useState(false)

    const [fields, setFields] = useState([])
    const [data, setData] = useState(null)
    const [atividades, setAtividades] = useState([])
    const [sistemasQualidade, setSistemasQualidade] = useState([])
    const [blocos, setBlocos] = useState([])
    const [info, setInfo] = useState('')

    const router = Router
    const { id } = router.query
    const staticUrl = backRoute(router.pathname) // Url sem ID

    const { settings } = useContext(SettingsContext)
    const mode = settings.mode

    const getZebradoStyle = index => ({
        backgroundColor:
            index % 2 !== 1 ? (mode === 'light' || mode === 'semi-dark' ? '#f7f7f9' : '#282a42') : 'inherit',
        padding: '0.5rem',
        borderBottom: '1px solid #4c4e641f',
        borderRadius: '0.2rem'
    })

    console.log('Renderizando...')

    useEffect(() => {
        setTitle('Formulário do Fornecedor')

        const getData = () => {
            api.get(`${staticUrl}/${user.unidadeID}`, { headers: { 'function-name': 'getData' } }).then(response => {
                console.log('getData: ', response.data)
                setFields(response.data.fields)
                setData(response.data.data)
                setAtividades(response.data.atividades)
                setSistemasQualidade(response.data.sistemasQualidade)
                setBlocos(response.data.blocos)
                setInfo(response.data.info)
            })
        }
        getData()
    }, [])

    // criar validação DINAMICA com reduce no Yup, varrendo campos fields e validando os valores vindos em defaultValues
    const defaultValues =
        data &&
        fields.reduce((defaultValues, field) => {
            defaultValues[field.nomeColuna] = data[field.nomeColuna]
            return defaultValues
        }, {})

    const {
        register,
        control,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm()

    console.log('errors: ', errors)

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
        setInfo({ resultado: newValue })
    }
    // Nomes e rotas dos relatórios passados para o componente FormHeader/MenuReports
    const dataReports = [
        {
            id: 1,
            name: 'Fornecedor',
            identification: '01',
            route: 'http://localhost:3333/relatorio/fornecedor'
        },
        {
            id: 2,
            name: 'Recepção',
            identification: '02',
            route: 'http://localhost:3333/relatorio/recepcao'
        },
        {
            id: 3,
            name: 'Ficha de Matrícula',
            identification: '03',
            route: '/reports/enrollment'
        },
        {
            id: 4,
            name: 'Ficha de Nacionalidade',
            identification: '04',
            route: 'fffffff'
        }
    ]

    // Gera o PDF do relatório
    const handleClickGenerateReport = item => {
        const route = item.route

        let fornecedorID = 1
        let unidadeID = user.unidadeID

        axios
        axios
            .post(route, { fornecedorID, unidadeID }, { responseType: 'arraybuffer' })
            .then(response => {
                // Converter o buffer do PDF em um objeto Blob
                const blob = new Blob([response.data], { type: 'application/pdf' })
                // Criar um objeto URL para o Blob

                const url = URL.createObjectURL(blob)
                // Abrir uma nova aba com o URL do relatório
                window.open(url, '_blank') // '_blank' abre em uma nova aba
            })
            .catch(error => {
                console.error('Erro ao gerar relatório', error)
            })
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Card Header */}
                <Card>
                    <FormHeader
                        btnCancel
                        btnSave
                        btnPrint
                        handleClickGenerateReport={handleClickGenerateReport}
                        dataReports={dataReports}
                        handleSubmit={() => handleSubmit(onSubmit)}
                        title='Fornecedor'
                    />
                    <CardContent>
                        {/* Header */}
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
                                                    label={field.nomeCampo}
                                                    placeholder={field.nomeCampo}
                                                    name={`header.${field.nomeColuna}`}
                                                    defaultValue={defaultValues[field.nomeColuna] ?? ''}
                                                    aria-describedby='validation-schema-nome'
                                                    error={errors?.header?.[field.nomeColuna] ? true : false}
                                                    {...register(`header.${field.nomeColuna}`, {
                                                        required: !!field.obrigatorio
                                                    })}
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
                                            <Grid key={indexItem} container sx={getZebradoStyle(indexItem)}>
                                                {/* Hidden do itemID */}
                                                <input
                                                    type='hidden'
                                                    name={`blocos[${indexBloco}].itens[${indexItem}].itemID`}
                                                    defaultValue={item.itemID}
                                                    {...register(`blocos[${indexBloco}].itens[${indexItem}].itemID`)}
                                                />

                                                {/* Descrição do item */}
                                                <Grid
                                                    item
                                                    xs={12}
                                                    md={6}
                                                    sx={{ display: 'flex', alignItems: 'center' }}
                                                >
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
                                                        {item.alternativas.length == 0 && item.alternativa == 'Data' && (
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
                                                                    // Data só está enviando quando altera pelo teclado, nao envia quando seleciona pelo calendário
                                                                    // Data está enviando validationError: null pro backend, como setar valor da data ao digiar no teclado e selecionar pelo calendário do datepicker ?
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
                                        name='observacao'
                                        defaultValue={info.observacao ?? ''}
                                        {...register('observacao')}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Resultado do formulário, onde conterá 3 colunas de checkbox, podendo selecionar apenas 1 opção, (Aprovado, Aprovado Parcial ou Reprovado) */}
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
                                                        name='resultado'
                                                        value={1}
                                                        checked={info.resultado == 1}
                                                        {...register('resultado')}
                                                        onChange={handleRadioChange}
                                                    />
                                                }
                                                label='Aprovado'
                                            />

                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        name='resultado'
                                                        value={2}
                                                        checked={info.resultado == 2}
                                                        {...register('resultado')}
                                                        onChange={handleRadioChange}
                                                    />
                                                }
                                                label='Aprovado Parcial'
                                            />

                                            <FormControlLabel
                                                control={
                                                    <Radio
                                                        name='resultado'
                                                        value={3}
                                                        checked={info.resultado == 3}
                                                        {...register('resultado')}
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

export default FormFornecedor

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
import { backRoute, generateReport } from 'src/configs/defaultConfigs'
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

const FormFornecedor = () => {
    const { user } = useContext(AuthContext)
    const { setTitle } = useContext(ParametersContext)
    const [isLoading, setLoading] = useState(true)

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
            name: 'Fornecedor',
            identification: '01',
            route: 'relatorio/fornecedor',
            params: {
                fornecedorID: id,
                unidadeID: user.unidadeID
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
                setLoading(false)
            })
        }
        getData()
    }, [])

    return (
        <>
            {isLoading && <Loading />}
            {!isLoading && (
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
                                                <Grid key={indexItem} container>
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
<<<<<<< HEAD
                        </Grid>
                    </CardContent>
                </Card>
            </form>
=======
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
            )}
>>>>>>> 0250c96097cbdf6c88bba03d170adc132ad57da0
        </>
    )
}

export default FormFornecedor

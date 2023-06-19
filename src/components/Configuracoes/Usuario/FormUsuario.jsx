import Router from 'next/router'
import { useEffect, useState, useContext, useRef } from 'react'
import { api } from 'src/configs/api'
import Icon from 'src/@core/components/icon'

import { cpfMask } from 'src/configs/masks'
import { validationCPF } from 'src/configs/validations'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

import {
    Card,
    CardContent,
    Grid,
    FormControl,
    TextField,
    Button,
    FormControlLabel,
    Typography,
    Autocomplete,
    Box,
    Checkbox,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    OutlinedInput,
    InputAdornment,
    IconButton,
    InputLabel,
    Avatar,
    Tooltip
} from '@mui/material'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormHelperText } from '@mui/material'
import Switch from '@mui/material/Switch'
import toast from 'react-hot-toast'
import DialogForm from 'src/components/Defaults/Dialogs/Dialog'
import { formType } from 'src/configs/defaultConfigs'
import FormHeader from '../../Defaults/FormHeader'
import { backRoute } from 'src/configs/defaultConfigs'
import { toastMessage } from 'src/configs/defaultConfigs'
import { AuthContext } from 'src/context/AuthContext'

//* Date
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br' // import locale

const FormUsuario = () => {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState()
    const { id } = Router.query
    const router = Router
    const type = formType(router.pathname) // Verifica se é novo ou edição
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const { user, setUser, loggedUnity } = useContext(AuthContext)
    // Acorddion das permissões
    // ** State
    const [expanded, setExpanded] = useState(false)
    const [expandedItem, setExpandedItem] = useState(false)
    const [photoProfile, setPhotoProfile] = useState(null)

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
        setValue,
        register
    } = useForm({})

    console.log('errors: ', errors)

    data &&
        data.units &&
        data.units.map((unit, index) => {
            setValue(`units[${index}].papel`, unit.papel)
            setValue(`units[${index}].profissao`, unit.profissao)
            setValue(`units[${index}].cargo`, unit.cargos)
        })

    // ** Senha e Confirma Senha
    const [statePassword, setStatePassword] = useState({
        showPassword: false,
        showConfirmPassword: false
    })
    const handleClickShowPassword = () => {
        setStatePassword({ ...statePassword, showPassword: !statePassword.showPassword })
    }
    const handleClickShowConfirmPassword = () => {
        setStatePassword({ ...statePassword, showConfirmPassword: !statePassword.showConfirmPassword })
    }
    //? Estados validar senha e confirmação de senha
    const [changePasswords, setChangePasswords] = useState(false)

    // Função que atualiza os dados ou cria novo dependendo do tipo da rota
    const onSubmit = async values => {
        console.log('🚀 ~ onSubmit:', values)
        try {
            if (type === 'new') {
                const result = await api.post(`${staticUrl}/novo`, values)
                router.replace(`${staticUrl}/${result.data.id}`)
                toast.success(toastMessage.successNew)
            } else if (type === 'edit') {
                await api.put(`${staticUrl}/${id}`, values)
                toast.success(toastMessage.successUpdate)
                console.log('🚀 ~ values:', values)
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error(toastMessage.errorRepeated)
            } else {
                console.log(error)
            }
        }
    }

    // Função que deleta os dados
    const handleClickDelete = async () => {
        try {
            await api.delete(`${staticUrl}/${id}`)
            router.push(staticUrl)
            toast.success(toastMessage.successDelete)
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error(toastMessage.pendingDelete)
                setOpen(false)
            } else {
                console.log(error)
            }
        }
    }

    // Função que adiciona uma nova unidade
    const addUnity = () => {
        const newUnity = [...data.units]
        newUnity.push({
            unidade: null,
            papel: null,
            profissao: null,
            cargos: [],
            status: true
        })
        setData({ ...data, units: newUnity })
    }

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }

    const handleChangeItem = item => (event, isExpanded) => {
        setExpandedItem(isExpanded ? item : false)
    }

    // Quando clicar no botão de foto, o input de foto é clicado abrindo o seletor de arquivos
    const fileInputRef = useRef(null)

    const handleAvatarClick = () => {
        fileInputRef.current.click()
    }

    // Ao selecionar a foto, ela é enviada para o servidor e salva no banco de dados, como resposta atualiza a foto atual
    const handleFileSelect = async event => {
        const selectedFile = event.target.files[0]
        if (selectedFile) {
            const formData = new FormData()
            formData.append('photoProfile', selectedFile)
            await api
                .post(`${staticUrl}/photo-profile/${id}`, formData)
                .then(response => {
                    setPhotoProfile(response.data)
                    console.log('id', id)
                    console.log('user.usuarioID', user.usuarioID)
                    if (user.usuarioID == id) {
                        setUser({ ...user, imagem: response.data })
                    }
                    toast.success('Foto de perfil atualizada com sucesso!')
                })
                .catch(error => {
                    console.log(error)
                    toast.error('Erro ao atualizar foto de perfil, tente novamente!')
                })
        }
    }

    const handleDeleteImage = async () => {
        try {
            await api.delete(`${staticUrl}/photo-profile/${id}`)
            setPhotoProfile(null)
            if (user.usuarioID == id) {
                setUser({ ...user, imagem: null })
            }
            toast.success('Foto de perfil removida com sucesso!')
        } catch (error) {
            console.log(error)
            toast.error('Erro ao remover foto de perfil, tente novamente!')
        }
    }

    // Função que traz os dados quando carrega a página e atualiza quando as dependências mudam
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await api.get(
                    `${staticUrl}/${id}?unidadeID=${loggedUnity.unidadeID}&papelID=${loggedUnity.papelID}&admin=${user.admin}`
                )
                setData(response.data)
                setPhotoProfile(response.data.imagem)
                console.log('🚀 ~ getData: ', response.data)
            } catch (error) {
                console.log(error)
            }
        }
        if (type === 'edit') getData()
    }, [])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Deixar atualizar e salvar a foto do usuário */}
                {(type == 'new' || data) && (
                    <Card>
                        <FormHeader
                            btnCancel
                            btnSave
                            handleSubmit={() => handleSubmit(onSubmit)}
                            btnDelete={type === 'edit' ? true : false}
                            onclickDelete={() => setOpen(true)}
                        />
                        <CardContent>
                            {/* Enviar via hidden flag indicando se usuário logado é admin */}
                            <input type='hidden' value={user.admin} name='admin' {...register(`admin`)} />
                            <input
                                type='hidden'
                                value={data?.usuarioUnidadeID}
                                name='usuarioUnidadeID'
                                {...register(`usuarioUnidadeID`)}
                            />
                            <input
                                type='hidden'
                                value={loggedUnity?.unidadeID}
                                name='unidadeID'
                                {...register(`unidadeID`)}
                            />
                            <input type='hidden' value={loggedUnity?.papelID} name='papelID' {...register(`papelID`)} />

                            <Grid container spacing={5} sx={{ mt: 2 }}>
                                {/* Foto */}
                                <Grid xs={12} sm={4} md={2} container spacing={5}>
                                    {/* Foto do usuário e upload */}
                                    <Grid
                                        item
                                        xs={12}
                                        md={12}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            mx: '17px',
                                            height: '250px',
                                            width: '250px',
                                            position: 'relative',
                                            mb: '10px',
                                            md: { height: 'auto', width: 'auto' }
                                        }}
                                    >
                                        {photoProfile && (
                                            <Tooltip title='Apagar foto do perfil' placement='top'>
                                                <IconButton
                                                    size='small'
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '30px',
                                                        right: '9px',
                                                        // opacity: '0.2',
                                                        zIndex: '20',
                                                        color: 'white',
                                                        opacity: '0.8',
                                                        backgroundColor: '#FF4D49',
                                                        '&:hover': {
                                                            backgroundColor: '#FF4D49',
                                                            opacity: '1'
                                                        }
                                                    }}
                                                    onClick={handleDeleteImage}
                                                >
                                                    <Icon icon='material-symbols:delete-outline' />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title={photoProfile ? 'Alterar foto' : 'Inserir foto'} placement='top'>
                                            <FormControl
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    height: '95%',
                                                    width: '95%'
                                                }}
                                            >
                                                <input
                                                    type='file'
                                                    ref={fileInputRef}
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileSelect}
                                                />
                                                <Avatar
                                                    variant='rounded'
                                                    alt='Victor Anderson'
                                                    sx={{ width: '100%', height: '100%', cursor: 'pointer' }}
                                                    src={photoProfile}
                                                    onClick={handleAvatarClick}
                                                />
                                            </FormControl>
                                        </Tooltip>
                                    </Grid>
                                </Grid>

                                {/* Campos a direita */}
                                <Grid xs={12} sm={8} md={10} container spacing={5}>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <TextField
                                                defaultValue={data?.nome}
                                                label='Nome'
                                                placeholder='Nome'
                                                aria-describedby='validation-schema-nome'
                                                name='nome'
                                                {...register(`nome`, { required: true })}
                                                error={errors.nome}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label='Data de Nascimento'
                                                    locale={dayjs.locale('pt-br')}
                                                    format='DD/MM/YYYY'
                                                    defaultValue={dayjs(new Date(data?.dataNascimento))}
                                                    name={`dataNascimento`}
                                                    onChange={value => setValue('dataNascimento', value)}
                                                    renderInput={params => (
                                                        <TextField
                                                            {...params}
                                                            variant='outlined'
                                                            error={errors?.dataNascimento}
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <TextField
                                                defaultValue={data?.email}
                                                label='E-mail'
                                                placeholder='E-mail'
                                                aria-describedby='validation-schema-nome'
                                                name='email'
                                                {...register(`email`, { required: true })}
                                                error={errors.email}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <TextField
                                                defaultValue={data?.cpf}
                                                label='CPF'
                                                placeholder='CPF'
                                                aria-describedby='validation-schema-nome'
                                                name='cpf'
                                                {...register(`cpf`, {
                                                    required: true,
                                                    validate: value => validationCPF(value) || 'CPF inválido'
                                                })}
                                                error={errors.cpf}
                                                helperText={errors.cpf?.message}
                                                inputProps={{
                                                    maxLength: 14,
                                                    onChange: e => {
                                                        setValue('cpf', cpfMask(e.target.value))
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <TextField
                                                defaultValue={data?.rg}
                                                label='RG'
                                                placeholder='RG'
                                                aria-describedby='validation-schema-nome'
                                                name='rg'
                                                {...register(`rg`, { required: false })}
                                                error={errors.rg}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <TextField
                                                defaultValue={data?.registroConselhoClasse}
                                                label='Registro Conselho Classe'
                                                placeholder='Registro Conselho Classe'
                                                aria-describedby='validation-schema-nome'
                                                name='registroConselhoClasse'
                                                {...register(`registroConselhoClasse`, { required: false })}
                                                error={errors.registroConselhoClasse}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {data && user.admin == 0 && (
                                        <>
                                            {/* Profissão */}
                                            <Grid item xs={12} md={4}>
                                                <FormControl fullWidth>
                                                    <Autocomplete
                                                        options={data.profissaoOptions}
                                                        getOptionLabel={option => option.nome || ''}
                                                        defaultValue={data.profissao ?? ''}
                                                        name={`profissao`}
                                                        {...register(`profissao`, {
                                                            required: false
                                                        })}
                                                        onChange={(index, value) => {
                                                            const newDataProfission = value
                                                                ? {
                                                                      id: value?.profissaoID,
                                                                      nome: value?.nome,
                                                                      edit: true
                                                                  }
                                                                : null
                                                            setValue(`profissao`, newDataProfission)
                                                        }}
                                                        renderInput={params => (
                                                            <TextField
                                                                {...params}
                                                                label='Selecione a profissão'
                                                                placeholder='Selecione a profissão'
                                                                aria-describedby='formulario-error'
                                                                error={errors?.profissao}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            {/* Cargos */}
                                            <Grid item xs={12} md={4}>
                                                <FormControl fullWidth>
                                                    <Autocomplete
                                                        multiple
                                                        limitTags={2}
                                                        options={data.cargosOptions}
                                                        getOptionLabel={option => option.nome || ''}
                                                        defaultValue={data?.cargo ?? []}
                                                        name={`cargo[]`}
                                                        {...register(`cargo`, {
                                                            required: false
                                                        })}
                                                        onChange={(index, value) => {
                                                            const newDataCargos = value
                                                                ? value.map(item => {
                                                                      return {
                                                                          id: item?.id,
                                                                          nome: item?.nome,
                                                                          edit: true
                                                                      }
                                                                  })
                                                                : []
                                                            setValue(`cargo`, newDataCargos)
                                                        }}
                                                        renderInput={params => (
                                                            <TextField
                                                                {...params}
                                                                label='Cargos'
                                                                placeholder='Cargos'
                                                                error={errors?.cargo}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    )}

                                    {/* Botão alterar senha */}
                                    {data && type == 'edit' && (
                                        <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                                <Button
                                                    variant='outlined'
                                                    startIcon={<Icon icon='mdi:lock-reset' />}
                                                    onClick={() => {
                                                        // alterar estado do botão e limpar senha do register se estado for false
                                                        setChangePasswords(!changePasswords)
                                                        if (changePasswords) {
                                                            setValue('senha', null)
                                                            setValue('confirmarSenha', null)
                                                        }
                                                    }}
                                                    // altura do botao igual aos demais campos texfield
                                                    sx={{ height: '56px' }}
                                                >
                                                    Alterar Senha
                                                </Button>
                                            </FormControl>
                                        </Grid>
                                    )}

                                    {(type == 'new' || changePasswords) && (
                                        <>
                                            {/* Senha */}
                                            <Grid item xs={12} md={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel htmlFor='input-confirm-password'>Senha</InputLabel>
                                                    <OutlinedInput
                                                        label='Senha'
                                                        id='input-password'
                                                        type={statePassword.showPassword ? 'text' : 'password'}
                                                        name={`senha`}
                                                        {...register(`senha`, {
                                                            required: type == 'new' ? true : false
                                                        })}
                                                        endAdornment={
                                                            <InputAdornment position='end'>
                                                                <IconButton
                                                                    edge='end'
                                                                    onClick={handleClickShowPassword}
                                                                >
                                                                    <Icon
                                                                        icon={
                                                                            statePassword.showPassword
                                                                                ? 'mdi:eye-outline'
                                                                                : 'mdi:eye-off-outline'
                                                                        }
                                                                    />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </FormControl>
                                            </Grid>

                                            {/* Confirma senha */}
                                            <Grid item xs={12} md={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel
                                                        htmlFor='input-confirm-password'
                                                        color={errors.confirmarSenha?.message ? 'error' : ''}
                                                    >
                                                        Confirmar Senha
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        label='Confirmar Senha'
                                                        id='input-password'
                                                        type={statePassword.showConfirmPassword ? 'text' : 'password'}
                                                        name={`confirmarSenha`}
                                                        {...register(`confirmarSenha`, {
                                                            required: type == 'new' ? true : false,
                                                            // validar senha e confirmação de senha somente se houver valor em senha
                                                            validate: value =>
                                                                value === watch('senha') || 'As senhas não conferem.'
                                                        })}
                                                        error={errors.confirmarSenha}
                                                        endAdornment={
                                                            <InputAdornment position='end'>
                                                                <IconButton
                                                                    edge='end'
                                                                    onClick={handleClickShowConfirmPassword}
                                                                >
                                                                    <Icon
                                                                        icon={
                                                                            statePassword.showConfirmPassword
                                                                                ? 'mdi:eye-outline'
                                                                                : 'mdi:eye-off-outline'
                                                                        }
                                                                    />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                    {errors.confirmarSenha?.message && (
                                                        <Typography variant='body2' color='error'>
                                                            {errors.confirmarSenha?.message}
                                                        </Typography>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {user.admin == 1 && type === 'edit' && (
                    <>
                        {/* Lista as unidades do usuario */}
                        {data &&
                            data.units &&
                            data.units.map((unit, indexUnit) => (
                                <>
                                    {/* Cada unidade */}
                                    <input
                                        type='hidden'
                                        value={unit.usuarioUnidadeID}
                                        name={`units[${indexUnit}].usuarioUnidadeID`}
                                        {...register(`units[${indexUnit}].usuarioUnidadeID`)}
                                    />

                                    <Card sx={{ mt: 4 }}>
                                        <CardContent>
                                            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                {unit.unidade ? unit.unidade.nome : 'Nova Unidade'}
                                                {unit.unidade?.id === loggedUnity.unidadeID &&
                                                    unit.papel?.id === loggedUnity.papelID && (
                                                        <CustomChip
                                                            size='small'
                                                            skin='light'
                                                            color='success'
                                                            label='Atual'
                                                            sx={{
                                                                mx: 2,
                                                                '& .MuiChip-label': { textTransform: 'capitalize' }
                                                            }}
                                                        />
                                                    )}
                                            </Typography>
                                            <Grid container spacing={5} sx={{ my: 2 }}>
                                                {/* Unidade (seleciona apenas no inserir uma nova) */}
                                                {!unit.unidadeID ? (
                                                    <Grid item xs={12} md={3}>
                                                        {/* Unidade nova, monta coluna com autocomplete para selecionar */}
                                                        <Autocomplete
                                                            options={data.unidadesOptions}
                                                            getOptionLabel={option => option.nome}
                                                            defaultValue={unit?.unidade ?? null}
                                                            name={`units[${indexUnit}].unidade`}
                                                            {...register(`units[${indexUnit}].unidade`, {
                                                                required: false
                                                            })}
                                                            onChange={(index, value) => {
                                                                const newDataUnit = value
                                                                    ? {
                                                                          id: value?.unidadeID,
                                                                          nome: value?.nome
                                                                      }
                                                                    : null
                                                                setValue(`units[${indexUnit}].unidade`, newDataUnit)
                                                            }}
                                                            renderInput={params => (
                                                                <TextField
                                                                    {...params}
                                                                    label='Selecione a unidade'
                                                                    placeholder='Selecionar unidade'
                                                                    aria-describedby='formulario-error'
                                                                    error={errors.units?.[indexUnit]?.unidade}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                ) : (
                                                    <input
                                                        type='hidden'
                                                        value={unit.unidadeID}
                                                        name={`units[${indexUnit}].unidadeID`}
                                                        {...register(`units[${indexUnit}].unidadeID`)}
                                                    />
                                                )}

                                                {/* Papel */}
                                                <Grid item xs={12} md={3}>
                                                    <Autocomplete
                                                        options={data.papelOptions}
                                                        getOptionLabel={option => option.nome}
                                                        defaultValue={unit.papel ?? null}
                                                        name={`units[${indexUnit}].papel`}
                                                        {...register(`units[${indexUnit}].papel`, {
                                                            required: false
                                                        })}
                                                        onChange={(index, value) => {
                                                            const newDataPapel = value
                                                                ? {
                                                                      id: value?.id,
                                                                      nome: value?.nome,
                                                                      edit: true
                                                                  }
                                                                : null
                                                            setValue(`units[${indexUnit}].papel`, newDataPapel)
                                                        }}
                                                        renderInput={params => (
                                                            <TextField
                                                                {...params}
                                                                label='Selecione o papel'
                                                                placeholder='Selecione o papel'
                                                                aria-describedby='formulario-error'
                                                                error={errors.units?.[indexUnit]?.papel}
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                {/* Profissão */}
                                                <Grid item xs={12} md={3}>
                                                    <Autocomplete
                                                        options={data.profissaoOptions}
                                                        getOptionLabel={option => option.nome || ''}
                                                        defaultValue={unit.profissao ?? ''}
                                                        name={`units[${indexUnit}].profissao`}
                                                        {...register(`units[${indexUnit}].profissao`, {
                                                            required: false
                                                        })}
                                                        onChange={(index, value) => {
                                                            const newDataProfission = value
                                                                ? {
                                                                      id: value?.profissaoID,
                                                                      nome: value?.nome,
                                                                      edit: true
                                                                  }
                                                                : null
                                                            setValue(`units[${indexUnit}].profissao`, newDataProfission)
                                                        }}
                                                        renderInput={params => (
                                                            <TextField
                                                                {...params}
                                                                label='Selecione a profissão'
                                                                placeholder='Selecione a profissão'
                                                                aria-describedby='formulario-error'
                                                                error={errors.units?.[indexUnit]?.profissao}
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                {/* Cargo(s) */}
                                                <Grid item xs={12} md={unit.unidadeID ? 6 : 3}>
                                                    <Autocomplete
                                                        multiple
                                                        limitTags={2}
                                                        options={data.cargosOptions}
                                                        getOptionLabel={option => option.nome || ''}
                                                        defaultValue={unit.cargos ?? []}
                                                        name={`units[${indexUnit}].cargo[]`}
                                                        {...register(`units[${indexUnit}].cargo`, {
                                                            required: false
                                                        })}
                                                        onChange={(index, value) => {
                                                            const newDataCargos = value
                                                                ? value.map(item => {
                                                                      return {
                                                                          id: item?.id,
                                                                          nome: item?.nome,
                                                                          edit: true
                                                                      }
                                                                  })
                                                                : []
                                                            setValue(`units[${indexUnit}].cargo`, newDataCargos)
                                                        }}
                                                        renderInput={params => (
                                                            <TextField
                                                                {...params}
                                                                label='Cargos'
                                                                placeholder='Cargos'
                                                                error={errors.units?.[indexUnit]?.cargo}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>

                                        {/* Permissões da unidade */}
                                        <CardContent>
                                            {/* Accordion */}
                                            <Accordion
                                                expanded={expanded === `panel-${indexUnit}`}
                                                onChange={handleChange(`panel-${indexUnit}`)}
                                                sx={{ border: '1px solid #e0e0e0', boxShadow: 'none' }}
                                            >
                                                <AccordionSummary
                                                    id='controlled-panel-header-1'
                                                    aria-controls='controlled-panel-content-1'
                                                    expandIcon={<Icon icon='mdi:chevron-down' />}
                                                    sx={{ display: 'flex', alignItems: 'center' }}
                                                >
                                                    <Typography>Permissões de Acesso</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    {unit.menu &&
                                                        unit.menu.map((menuGroup, indexMenuGroup) => (
                                                            <>
                                                                {/* Divisor */}
                                                                <Grid container spacing={5} sx={{ my: 2 }}>
                                                                    <Grid item xs={12} md={8}>
                                                                        <Typography variant='body2'>
                                                                            {menuGroup.nome}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12} md={1}>
                                                                        <Typography
                                                                            variant='body2'
                                                                            sx={{ textAlign: 'center' }}
                                                                        >
                                                                            Ler
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12} md={1}>
                                                                        <Typography
                                                                            variant='body2'
                                                                            sx={{ textAlign: 'center' }}
                                                                        >
                                                                            Inserir
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12} md={1}>
                                                                        <Typography
                                                                            variant='body2'
                                                                            sx={{ textAlign: 'center' }}
                                                                        >
                                                                            Editar
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12} md={1}>
                                                                        <Typography
                                                                            variant='body2'
                                                                            sx={{ textAlign: 'center' }}
                                                                        >
                                                                            Excluir
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                                {menuGroup.menu &&
                                                                    menuGroup.menu.map((menu, indexMenu) => (
                                                                        <>
                                                                            {menu.rota ? (
                                                                                <>
                                                                                    {/* Menu com rota => seleciona permissões */}
                                                                                    <Grid
                                                                                        container
                                                                                        spacing={5}
                                                                                        sx={{ my: 2 }}
                                                                                    >
                                                                                        {/* Menu título */}
                                                                                        <Grid item xs={12} md={8}>
                                                                                            <Typography variant='subtitle1'>
                                                                                                {menu.nome}
                                                                                            </Typography>
                                                                                        </Grid>

                                                                                        {/* Hidden rota */}
                                                                                        <input
                                                                                            type='hidden'
                                                                                            value={menu.rota}
                                                                                            name={`units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].rota`}
                                                                                            {...register(
                                                                                                `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].rota`
                                                                                            )}
                                                                                        />

                                                                                        {/* Ler */}
                                                                                        <Grid
                                                                                            item
                                                                                            xs={12}
                                                                                            md={1}
                                                                                            sx={{ textAlign: 'center' }}
                                                                                        >
                                                                                            <Checkbox
                                                                                                defaultChecked={
                                                                                                    menu.ler
                                                                                                }
                                                                                                name={`units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].ler`}
                                                                                                {...register(
                                                                                                    `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].ler`
                                                                                                )}
                                                                                                onChange={e => {
                                                                                                    setValue(
                                                                                                        `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].edit`,
                                                                                                        true
                                                                                                    )
                                                                                                }}
                                                                                            />
                                                                                        </Grid>

                                                                                        {/* Inserir */}
                                                                                        <Grid
                                                                                            item
                                                                                            xs={12}
                                                                                            md={1}
                                                                                            sx={{ textAlign: 'center' }}
                                                                                        >
                                                                                            <Checkbox
                                                                                                defaultChecked={
                                                                                                    menu.inserir
                                                                                                }
                                                                                                name={`units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].inserir`}
                                                                                                {...register(
                                                                                                    `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].inserir`
                                                                                                )}
                                                                                                onChange={e => {
                                                                                                    setValue(
                                                                                                        `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].edit`,
                                                                                                        true
                                                                                                    )
                                                                                                }}
                                                                                            />
                                                                                        </Grid>

                                                                                        {/* Editar */}
                                                                                        <Grid
                                                                                            item
                                                                                            xs={12}
                                                                                            md={1}
                                                                                            sx={{ textAlign: 'center' }}
                                                                                        >
                                                                                            <Checkbox
                                                                                                defaultChecked={
                                                                                                    menu.editar
                                                                                                }
                                                                                                name={`units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].editar`}
                                                                                                {...register(
                                                                                                    `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].editar`
                                                                                                )}
                                                                                                onChange={e => {
                                                                                                    setValue(
                                                                                                        `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].edit`,
                                                                                                        true
                                                                                                    )
                                                                                                }}
                                                                                            />
                                                                                        </Grid>

                                                                                        {/* Excluir */}
                                                                                        <Grid
                                                                                            item
                                                                                            xs={12}
                                                                                            md={1}
                                                                                            sx={{ textAlign: 'center' }}
                                                                                        >
                                                                                            <Checkbox
                                                                                                defaultChecked={
                                                                                                    menu.excluir
                                                                                                }
                                                                                                name={`units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].excluir`}
                                                                                                {...register(
                                                                                                    `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].excluir`
                                                                                                )}
                                                                                                onChange={e => {
                                                                                                    setValue(
                                                                                                        `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].edit`,
                                                                                                        true
                                                                                                    )
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    {/* Menu sem rota => accordion pra abrir submenu */}
                                                                                    <Accordion
                                                                                        expanded={
                                                                                            expandedItem ===
                                                                                            `item-${indexUnit}-${indexMenuGroup}-${indexMenu}`
                                                                                        }
                                                                                        onChange={handleChangeItem(
                                                                                            `item-${indexUnit}-${indexMenuGroup}-${indexMenu}`
                                                                                        )}
                                                                                        sx={{
                                                                                            border: '1px solid #e0e0e0',
                                                                                            boxShadow: 'none'
                                                                                        }}
                                                                                    >
                                                                                        <AccordionSummary
                                                                                            id='controlled-panel-header-1'
                                                                                            aria-controls='controlled-panel-content-1'
                                                                                            expandIcon={
                                                                                                <Icon icon='mdi:chevron-down' />
                                                                                            }
                                                                                            sx={{
                                                                                                display: 'flex',
                                                                                                alignItems: 'center'
                                                                                            }}
                                                                                        >
                                                                                            <Typography>
                                                                                                {menu.nome}
                                                                                            </Typography>
                                                                                        </AccordionSummary>
                                                                                        <AccordionDetails>
                                                                                            {menu.submenu &&
                                                                                                menu.submenu.map(
                                                                                                    (
                                                                                                        submenu,
                                                                                                        indexSubmenu
                                                                                                    ) => (
                                                                                                        <>
                                                                                                            {/* Submenu */}
                                                                                                            <Grid
                                                                                                                container
                                                                                                                spacing={
                                                                                                                    5
                                                                                                                }
                                                                                                                sx={{
                                                                                                                    my: 2
                                                                                                                }}
                                                                                                            >
                                                                                                                {/* Submenu título */}
                                                                                                                <Grid
                                                                                                                    item
                                                                                                                    xs={
                                                                                                                        12
                                                                                                                    }
                                                                                                                    md={
                                                                                                                        8
                                                                                                                    }
                                                                                                                >
                                                                                                                    <Typography variant='subtitle1'>
                                                                                                                        {
                                                                                                                            submenu.nome
                                                                                                                        }
                                                                                                                    </Typography>
                                                                                                                </Grid>

                                                                                                                {/* Hidden rota */}
                                                                                                                <input
                                                                                                                    type='hidden'
                                                                                                                    value={
                                                                                                                        submenu.rota
                                                                                                                    }
                                                                                                                    name={`units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].submenu[${indexSubmenu}].rota`}
                                                                                                                    {...register(
                                                                                                                        `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].submenu[${indexSubmenu}].rota`
                                                                                                                    )}
                                                                                                                />

                                                                                                                {/* Ler */}
                                                                                                                <Grid
                                                                                                                    item
                                                                                                                    xs={
                                                                                                                        12
                                                                                                                    }
                                                                                                                    md={
                                                                                                                        1
                                                                                                                    }
                                                                                                                    sx={{
                                                                                                                        textAlign:
                                                                                                                            'center'
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <Checkbox
                                                                                                                        defaultChecked={
                                                                                                                            submenu.ler
                                                                                                                        }
                                                                                                                        name={`units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].submenu[${indexSubmenu}].ler`}
                                                                                                                        {...register(
                                                                                                                            `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].submenu[${indexSubmenu}].ler`
                                                                                                                        )}
                                                                                                                        onChange={e => {
                                                                                                                            setValue(
                                                                                                                                `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].submenu[${indexSubmenu}].edit`,
                                                                                                                                true
                                                                                                                            )
                                                                                                                        }}
                                                                                                                    />
                                                                                                                </Grid>

                                                                                                                {/* Inserir */}
                                                                                                                <Grid
                                                                                                                    item
                                                                                                                    xs={
                                                                                                                        12
                                                                                                                    }
                                                                                                                    md={
                                                                                                                        1
                                                                                                                    }
                                                                                                                    sx={{
                                                                                                                        textAlign:
                                                                                                                            'center'
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <Checkbox
                                                                                                                        defaultChecked={
                                                                                                                            submenu.inserir
                                                                                                                        }
                                                                                                                        name={`units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].submenu[${indexSubmenu}].inserir`}
                                                                                                                        {...register(
                                                                                                                            `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].submenu[${indexSubmenu}].inserir`
                                                                                                                        )}
                                                                                                                        onChange={e => {
                                                                                                                            setValue(
                                                                                                                                `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].submenu[${indexSubmenu}].edit`,
                                                                                                                                true
                                                                                                                            )
                                                                                                                        }}
                                                                                                                    />
                                                                                                                </Grid>

                                                                                                                {/* Editar */}
                                                                                                                <Grid
                                                                                                                    item
                                                                                                                    xs={
                                                                                                                        12
                                                                                                                    }
                                                                                                                    md={
                                                                                                                        1
                                                                                                                    }
                                                                                                                    sx={{
                                                                                                                        textAlign:
                                                                                                                            'center'
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <Checkbox
                                                                                                                        defaultChecked={
                                                                                                                            submenu.editar
                                                                                                                        }
                                                                                                                        name={`units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].submenu[${indexSubmenu}].editar`}
                                                                                                                        {...register(
                                                                                                                            `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].submenu[${indexSubmenu}].editar`
                                                                                                                        )}
                                                                                                                        onChange={e => {
                                                                                                                            setValue(
                                                                                                                                `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].submenu[${indexSubmenu}].edit`,
                                                                                                                                true
                                                                                                                            )
                                                                                                                        }}
                                                                                                                    />
                                                                                                                </Grid>

                                                                                                                {/* Excluir */}
                                                                                                                <Grid
                                                                                                                    item
                                                                                                                    xs={
                                                                                                                        12
                                                                                                                    }
                                                                                                                    md={
                                                                                                                        1
                                                                                                                    }
                                                                                                                    sx={{
                                                                                                                        textAlign:
                                                                                                                            'center'
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <Checkbox
                                                                                                                        defaultChecked={
                                                                                                                            submenu.excluir
                                                                                                                        }
                                                                                                                        name={`units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].submenu[${indexSubmenu}].excluir`}
                                                                                                                        {...register(
                                                                                                                            `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].submenu[${indexSubmenu}].excluir`
                                                                                                                        )}
                                                                                                                        onChange={e => {
                                                                                                                            setValue(
                                                                                                                                `units[${indexUnit}].menuGroup[${indexMenuGroup}].menu[${indexMenu}].submenu[${indexSubmenu}].edit`,
                                                                                                                                true
                                                                                                                            )
                                                                                                                        }}
                                                                                                                    />
                                                                                                                </Grid>
                                                                                                            </Grid>
                                                                                                        </>
                                                                                                    )
                                                                                                )}
                                                                                        </AccordionDetails>
                                                                                    </Accordion>
                                                                                </>
                                                                            )}
                                                                        </>
                                                                    ))}
                                                            </>
                                                        ))}
                                                </AccordionDetails>
                                            </Accordion>
                                        </CardContent>
                                    </Card>
                                </>
                            ))}

                        {/* Adicionar unidade */}
                        <Grid container spacing={5} sx={{ my: 2 }}>
                            <Grid item xs={12} md={3}>
                                <Button
                                    startIcon={<Icon icon='material-symbols:add-circle-outline-rounded' />}
                                    variant='outlined'
                                    onClick={() => {
                                        addUnity()
                                    }}
                                >
                                    Inserir unidade
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                )}
            </form>

            <DialogForm
                text='Tem certeza que deseja excluir?'
                title='Excluir dado'
                openModal={open}
                handleClose={() => setOpen(false)}
                handleSubmit={handleClickDelete}
                btnCancel
                btnConfirm
            />
        </>
    )
}

export default FormUsuario

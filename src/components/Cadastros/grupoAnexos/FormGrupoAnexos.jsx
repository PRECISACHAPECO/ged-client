import Router from 'next/router'
import { useEffect, useState, useRef, useContext } from 'react'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import { api } from 'src/configs/api'
import {
    Card,
    CardContent,
    Grid,
    FormControl,
    TextField,
    FormControlLabel,
    Checkbox,
    Typography,
    CardHeader,
    Button,
    Box,
    Tooltip,
    IconButton,
    Autocomplete
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import DialogForm from 'src/components/Defaults/Dialogs/Dialog'
import { formType } from 'src/configs/defaultConfigs'
import FormHeader from '../../Defaults/FormHeader'
import { backRoute } from 'src/configs/defaultConfigs'
import { toastMessage } from 'src/configs/defaultConfigs'

const FormGrupoAnexos = () => {
    const { id } = Router.query
    const router = Router
    const [data, setData] = useState(null)
    const type = formType(router.pathname) // Verifica se é novo ou edição
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const { title } = useContext(ParametersContext)
    const inputRef = useRef(null)
    const { loggedUnity } = useContext(AuthContext)
    const [savingForm, setSavingForm] = useState(false)
    const [removedItems, setRemovedItems] = useState([]) //? Itens removidos do formulário

    const {
        trigger,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
        register
    } = useForm()

    const getData = async () => {
        try {
            await api.get(`${staticUrl}/getData/${id}`).then(response => {
                console.log('🚀 ~ getData:', response.data)
                setData(response.data)
                reset(response.data) //* Insere os dados no formulário
            })
        } catch (error) {
            console.log(error)
        }
    }

    const addItem = () => {
        const newValue = { ...data }
        newValue.items.push({
            nome: '',
            descricao: '',
            status: true,
            obrigatorio: true
        })
        setData(newValue)
    }

    const removeItem = (value, index) => {
        if (data.items.length === 1) {
            toast.error('É necessário ter pelo menos um item!')
            return
        }

        //* Adiciona item removido ao array
        if (value.id) {
            setRemovedItems([...removedItems, value.id])
        }

        const newValue = [...data.items]
        newValue.splice(index, 1)
        setData({ ...data, items: newValue })

        setValue(`items`, newValue) //* Remove item do formulário
    }

    const onSubmit = async values => {
        //* Valores auxiliares
        values['removedItems'] = removedItems
        values['unidade'] = loggedUnity.unidadeID

        console.log('🚀 ~ newData vai para o back:', values)

        try {
            if (type === 'new') {
                await api.post(`${staticUrl}/novo/insertData`, values)
                router.push(staticUrl)
                toast.success(toastMessage.successNew)
            } else if (type === 'edit') {
                await api.post(`${staticUrl}/${id}`, values)
                toast.success(toastMessage.successUpdate)
            }
            setSavingForm(!savingForm)
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error(toastMessage.errorRepeated)
            } else {
                console.log(error)
            }
        }

        // reset()
    }

    useEffect(() => {
        getData()

        setTimeout(() => {
            trigger()
        }, 200)
    }, [savingForm])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                {/* Botões cabeçalho */}
                <FormHeader
                    btnCancel
                    btnSave
                    btnDelete={type === 'edit' ? true : false}
                    // onclickDelete={() => setOpen(true)}
                />

                {/* Formulário */}
                {data && (
                    <CardContent>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={11}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Nome'
                                        placeholder='Nome'
                                        {...register('fields.nome', { required: true })}
                                        error={Boolean(errors?.fields?.nome)}
                                        aria-describedby='validation-schema-nome'
                                        inputRef={inputRef}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        multiple
                                        limitTags={5}
                                        options={data.formulario.options} // array
                                        getOptionLabel={option => option.nome || ''}
                                        defaultValue={data?.formulario.fields ?? []}
                                        {...register(`formulario.fields`, {
                                            required: true
                                        })}
                                        onChange={(index, value) => {
                                            const newValue = value
                                                ? value.map(item => {
                                                      return {
                                                          id: item?.id,
                                                          nome: item?.nome,
                                                          edit: true
                                                      }
                                                  })
                                                : []
                                            setValue(`formulario.fields`, newValue)
                                        }}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label='Formulários'
                                                placeholder='Formulários'
                                                error={errors?.formulario?.fields ? true : false}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                )}
            </Card>

            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography>Itens</Typography>
                    <Grid container spacing={3}>
                        {data &&
                            data?.items?.map((item, index) => (
                                <>
                                    <Grid item xs={12} md={3}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label='Nome'
                                                placeholder='Nome'
                                                {...register(`items[${index}].nome`, { required: true })}
                                                error={errors?.items?.[index]?.nome ? true : false}
                                                aria-describedby='validation-schema-nome'
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label='Descrição'
                                                placeholder='Descrição'
                                                {...register(`items[${index}].descricao`, { required: false })}
                                                error={errors?.items?.[index]?.descricao ? true : false}
                                                aria-describedby='validation-schema-descricao'
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={1}>
                                        <Typography variant='caption'>{index === 0 ? 'Obrigatório' : ``}</Typography>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    sx={{ ml: 4 }}
                                                    {...register(`items[${index}].obrigatorio`)}
                                                    defaultChecked={item.obrigatorio == 1 ? true : false}
                                                />
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={1}>
                                        <Typography variant='caption'>{index === 0 ? 'Status' : ``}</Typography>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    sx={{ ml: 4 }}
                                                    {...register(`items[${index}].obrigatorio`)}
                                                    defaultChecked={item.obrigatorio == 1 ? true : false}
                                                />
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={1}>
                                        <Typography variant='caption'>{index === 0 ? 'Remover' : ``}</Typography>
                                        <Tooltip
                                            title={
                                                2 == 1
                                                    ? `Este item não pode mais ser removido pois já foi respondido em um formulário`
                                                    : `Remover este item`
                                            }
                                        >
                                            <IconButton
                                                color='error'
                                                onClick={() => removeItem(item, index)}
                                                sx={{
                                                    opacity: 2 === 1 ? 0.5 : 1,
                                                    cursor: 2 === 1 ? 'default' : 'pointer'
                                                }}
                                            >
                                                <Icon icon='tabler:trash-filled' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </>
                            ))}
                    </Grid>
                    <Button
                        variant='outlined'
                        color='primary'
                        sx={{ mt: 4 }}
                        startIcon={<Icon icon='material-symbols:add-circle-outline-rounded' />}
                        onClick={() => {
                            addItem()
                        }}
                    >
                        Inserir item
                    </Button>
                </CardContent>
            </Card>
        </form>
    )
}

export default FormGrupoAnexos

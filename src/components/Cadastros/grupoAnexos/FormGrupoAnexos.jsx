import Router from 'next/router'
import { useEffect, useState, useRef, useContext } from 'react'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import { api } from 'src/configs/api'
import { Card, CardContent, Grid, Typography, Button } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import DialogForm from 'src/components/Defaults/Dialogs/Dialog'
import { formType } from 'src/configs/defaultConfigs'
import FormHeader from '../../Defaults/FormHeader'
import { backRoute } from 'src/configs/defaultConfigs'
import { toastMessage } from 'src/configs/defaultConfigs'

//* Custom components
import Select from 'src/components/Form/Select'
import Input from 'src/components/Form/Input'
import Check from 'src/components/Form/Check'
import Remove from 'src/components/Form/Remove'

const FormGrupoAnexos = () => {
    const { id } = Router.query
    const router = Router
    const [data, setData] = useState(null)
    const [openDelete, setOpenDelete] = useState(false) //? Dialog de confirmação de exclusão
    const type = formType(router.pathname) // Verifica se é novo ou edição
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const { title } = useContext(ParametersContext)
    // const inputRef = useRef(null)
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
            const route = type === 'new' ? `${staticUrl}/new/getData` : `${staticUrl}/getData/${id}`
            console.log('🚀 ~ route:', route)
            await api.post(route, { unidadeID: loggedUnity.unidadeID }).then(response => {
                //? Atualiza obrigatorio e status de 0 ou 1 pra true ou false
                // response.data.fields.status = response.data.fields.status == 1 ? true : false
                // response.data.items.map(item => {
                //     item.obrigatorio = item.obrigatorio == 1 || type == 'new' ? true : false
                //     item.status = item.status == 1 || type == 'new' ? true : false
                // })
                setData(response.data)
                reset(response.data) //* Insere os dados no formulário

                console.log('🚀 ~ getData:', response.data)
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

        try {
            if (type === 'new') {
                await api.post(`${staticUrl}/new/insertData`, values).then(response => {
                    router.push(`${staticUrl}/${response.data}`)
                    toast.success(toastMessage.successNew)
                })
            } else if (type === 'edit') {
                await api.post(`${staticUrl}/updateData/${id}`, values)
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
    }

    //! Função que deleta os dados
    const handleDelete = async () => {
        try {
            await api.delete(`${staticUrl}/deleteData/${id}`)
            router.push(staticUrl)
            toast.success(toastMessage.successDelete)
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error(toastMessage.pendingDelete)
                setOpenDelete(false)
            } else {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        getData()

        //? Seta error nos campos obrigatórios
        if (type === 'new') {
            setTimeout(() => {
                trigger()
            }, 300)
        }
    }, [])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    {/* Botões cabeçalho */}
                    <FormHeader
                        btnCancel
                        btnSave
                        btnDelete={type === 'edit' ? true : false}
                        onclickDelete={() => setOpenDelete(true)}
                    />

                    {/* Formulário */}
                    {data && (
                        <CardContent>
                            <Grid container spacing={4}>
                                <Input
                                    xs={12}
                                    md={11}
                                    title='Nome'
                                    name='fields.nome'
                                    required={true}
                                    register={register}
                                    errors={errors?.fields?.nome}
                                />

                                <Check
                                    xs={12}
                                    md={1}
                                    title='Ativo'
                                    name='fields.status'
                                    value={data.fields.status}
                                    typePage={type}
                                    register={register}
                                />

                                <Select
                                    xs={12}
                                    md={12}
                                    title='Formulários'
                                    name='formulario.fields'
                                    value={data?.formulario.fields ?? null}
                                    multiple={true}
                                    limitTags={5}
                                    required={true}
                                    options={data.formulario.options}
                                    register={register}
                                    setValue={setValue}
                                    errors={errors?.formulario?.fields}
                                />
                            </Grid>
                        </CardContent>
                    )}
                </Card>

                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <Typography sx={{ mb: 5 }}>Itens</Typography>
                        <Grid container spacing={3}>
                            {data &&
                                data?.items?.map((item, index) => (
                                    <>
                                        <Input
                                            xs={12}
                                            md={3}
                                            title='Nome'
                                            name={`items[${index}].nome`}
                                            required={true}
                                            register={register}
                                            errors={errors?.items?.[index]?.nome}
                                        />

                                        <Input
                                            xs={12}
                                            md={6}
                                            title='Descrição'
                                            name={`items[${index}].descricao`}
                                            required={false}
                                            register={register}
                                            errors={errors?.items?.[index]?.descricao}
                                        />

                                        <Check
                                            xs={12}
                                            md={1}
                                            title='Obrigatório'
                                            index={index}
                                            name={`items[${index}].obrigatorio`}
                                            value={item.obrigatorio}
                                            typePage={type}
                                            register={register}
                                        />

                                        <Check
                                            xs={12}
                                            md={1}
                                            title='Status'
                                            index={index}
                                            name={`items[${index}].status`}
                                            value={item.status}
                                            typePage={type}
                                            register={register}
                                        />

                                        <Remove
                                            xs={12}
                                            md={1}
                                            title='Remover'
                                            index={index}
                                            removeItem={removeItem}
                                            item={item}
                                            pending={item.hasPending}
                                            textSuccess='Remover este item'
                                            textError='Este item não pode mais ser removido pois possui anexo vinculado a ele'
                                        />
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

            {/* Modal excluir */}
            <DialogForm
                text='Tem certeza que deseja excluir?'
                title={'Excluir ' + title}
                openModal={openDelete}
                handleClose={() => setOpenDelete(false)}
                handleSubmit={handleDelete}
                btnCancel
                btnConfirm
            />
        </>
    )
}

export default FormGrupoAnexos

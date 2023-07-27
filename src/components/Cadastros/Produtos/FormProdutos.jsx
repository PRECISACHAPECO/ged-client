import Router from 'next/router'
import { useEffect, useState } from 'react'
import { api } from 'src/configs/api'
import { Card, CardContent, Grid } from '@mui/material'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import DialogForm from 'src/components/Defaults/Dialogs/Dialog'
import { formType } from 'src/configs/defaultConfigs'
import FormHeader from '../../Defaults/FormHeader'
import { backRoute } from 'src/configs/defaultConfigs'
import { toastMessage } from 'src/configs/defaultConfigs'
import Loading from 'src/components/Loading'
import { ParametersContext } from 'src/context/ParametersContext'
import { RouteContext } from 'src/context/RouteContext'
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import Input from 'src/components/Form/Input'
import Check from 'src/components/Form/Check'

const FormProdutos = ({ id }) => {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(null)
    const { setId } = useContext(RouteContext)
    const router = Router
    const type = id && id > 0 ? 'edit' : 'new'
    const staticUrl = router.pathname
    const { title } = useContext(ParametersContext)
    const { loggedUnity } = useContext(AuthContext)

    const {
        trigger,
        handleSubmit,
        reset,
        formState: { errors },
        register
    } = useForm()

    //? Envia dados para a api
    const onSubmit = async values => {
        const newValues = {
            fields: {
                ...values.fields,
                unidadeID: loggedUnity.unidadeID
            }
        }
        try {
            if (type === 'new') {
                await api.post(`${backRoute(staticUrl)}/new/insertData`, newValues).then(response => {
                    router.push(`${backRoute(staticUrl)}`) //? backRoute pra remover 'novo' da rota
                    setId(response.data)
                    toast.success(toastMessage.successNew)
                })
            } else if (type === 'edit') {
                await api.post(`${staticUrl}/updateData/${id}`, values)
                toast.success(toastMessage.successUpdate)
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error(toastMessage.errorRepeated)
            } else {
                console.log(error)
            }
        }
    }

    //? Função que deleta os dados
    const handleClickDelete = async () => {
        try {
            await api.delete(`${staticUrl}/${id}`)
            setId(null)
            setOpen(false)
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

    //? Dados iniciais ao carregar página
    const getData = async () => {
        if (type == 'new') {
            setData({
                fields: {
                    nome: '',
                    status: 1
                }
            })
        }
        try {
            const route = type === 'new' ? `${backRoute(staticUrl)}/new/getData` : `${staticUrl}/getData/${id}`
            await api.post(route, { id }).then(response => {
                setData(response.data)
                console.log('🚀 ~ response.data:', response.data)
                reset(response.data) //* Insere os dados no formulário
            })
        } catch (error) {
            console.log(error)
        }
    }

    //? Função que traz os dados quando carrega a página e atualiza quando as dependências mudam
    useEffect(() => {
        getData()

        //? Seta error nos campos obrigatórios
        if (type === 'new') {
            setTimeout(() => {
                trigger()
            }, 300)
        }
    }, [id])

    return (
        <>
            {!data && <Loading />}
            {data && (
                <Card>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormHeader
                            btnCancel
                            btnSave
                            handleSubmit={() => handleSubmit(onSubmit)}
                            btnDelete={type === 'edit' ? true : false}
                            onclickDelete={() => setOpen(true)}
                            type={type}
                        />
                        <CardContent>
                            <Grid container spacing={5}>
                                <Input
                                    xs={12}
                                    md={8}
                                    title='Nome'
                                    name='fields.nome'
                                    required={true}
                                    register={register}
                                    errors={errors?.fields?.nome}
                                />
                                <Input
                                    xs={12}
                                    md={3}
                                    title='Unidade de Medida'
                                    name='fields.unidadeMedida'
                                    required={true}
                                    register={register}
                                    errors={errors?.fields?.unidadeMedida}
                                />
                                <Check
                                    xs={12}
                                    md={1}
                                    title='Ativo'
                                    name='fields.status'
                                    value={data?.fields.status}
                                    typePage={type}
                                    register={register}
                                />
                            </Grid>
                        </CardContent>
                    </form>
                </Card>
            )}
            <DialogForm
                text='Tem certeza que deseja excluir?'
                title={'Excluir ' + title}
                openModal={open}
                handleClose={() => setOpen(false)}
                handleSubmit={handleClickDelete}
                btnCancel
                btnConfirm
            />
        </>
    )
}

export default FormProdutos

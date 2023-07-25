import Router from 'next/router'
import axios from 'axios'
import { useEffect, useState, useContext } from 'react'
import { ParametersContext } from 'src/context/ParametersContext'
import { api } from 'src/configs/api'
import { Card, CardContent, Grid } from '@mui/material'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import DialogForm from 'src/components/Defaults/Dialogs/Dialog'
import { formType } from 'src/configs/defaultConfigs'
import FormHeader from '../../Defaults/FormHeader'
import { backRoute } from 'src/configs/defaultConfigs'
import { toastMessage } from 'src/configs/defaultConfigs'
import Input from 'src/components/Form/Input'
import Select from 'src/components/Form/Select'
import Check from 'src/components/Form/Check'

const FormItem = () => {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(null)

    //! Se perder Id, copia do localstorage
    const { title, setStorageId, getStorageId } = useContext(ParametersContext)
    const router = Router
    let id = router.query.id
    if (!id) id = getStorageId()
    useEffect(() => {
        setStorageId(id)
    }, [])

    const type = formType(router.pathname) // Verifica se é novo ou edição
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const {
        trigger,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors },
        register
    } = useForm()

    //? Envia dados para a api
    const onSubmit = async values => {
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

    //? Deleta os dados
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

    //? Dados iniciais ao carregar página
    const getData = async () => {
        try {
            const route = type === 'new' ? `api/${staticUrl}/new/getData` : `api/${staticUrl}/getData/${id}`
            // console.log('🚀 ~ getData:', response.data)

            await axios.post(`https://demo.gedagro.com.br/api/cadastros/item/getData/${id}`, { id }).then(response => {
                console.log('🚀 ~ route:', route)
                setData(response.data)
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
    }, [])

    return (
        <>
            {data && (
                <Card>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormHeader
                            btnCancel
                            btnSave
                            handleSubmit={() => handleSubmit(onSubmit)}
                            btnDelete={type === 'edit' ? true : false}
                            onclickDelete={() => setOpen(true)}
                        />
                        <CardContent>
                            <Grid container spacing={5}>
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
                                    value={data?.formulario.fields}
                                    required={true}
                                    options={data.formulario.options}
                                    register={register}
                                    control={control}
                                    setValue={setValue}
                                    errors={errors?.formulario?.fields}
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

export default FormItem

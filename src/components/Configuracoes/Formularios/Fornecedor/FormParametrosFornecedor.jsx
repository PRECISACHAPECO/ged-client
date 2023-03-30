import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, Checkbox, Grid, List, ListItem, ListItemButton, Typography } from '@mui/material'
import Router from 'next/router'
import { backRoute } from 'src/configs/defaultConfigs'
import { api } from 'src/configs/api'
import FormHeader from 'src/components/FormHeader'

const FormParametrosFornecedor = () => {
    const [fields, setFields] = useState([])
    const router = Router
    const staticUrl = backRoute(router.pathname) // Url sem ID

    useEffect(() => {
        // setTitle('Formulário do Fornecedor')
        const getData = () => {
            api.get(`${staticUrl}/fornecedor`).then(response => {
                console.log('res: ', response.data)
                setFields(response.data)
            })
        }
        getData()
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors }

        // reset
    } = useForm()

    const onSubmit = async data => {
        console.log('onSubmit:', data)
        try {
            await api.put(`${staticUrl}/fornecedor`, data.fields).then(response => {
                console.log('editado: ', response.data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormHeader btnCancel btnSave handleSubmit={() => handleSubmit(onSubmit)} />
                <CardContent>
                    {/* Lista campos */}
                    <List component='nav' aria-label='main mailbox'>
                        <Grid container spacing={2}>
                            {/* Cabeçalho */}
                            <ListItem divider disablePadding>
                                <ListItemButton>
                                    <Grid item md={4}>
                                        <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
                                            Nome do Campo
                                        </Typography>
                                    </Grid>
                                    <Grid item md={3}>
                                        <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
                                            Mostra no Formulário
                                        </Typography>
                                    </Grid>
                                    <Grid item md={3}>
                                        <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
                                            Obrigatório
                                        </Typography>
                                    </Grid>
                                </ListItemButton>
                            </ListItem>

                            {fields.map((field, index) => (
                                <>
                                    <ListItem divider disablePadding>
                                        <ListItemButton>
                                            <input
                                                type='hidden'
                                                name={`fields.[${index}].parFornecedorID`}
                                                defaultValue={field.parFornecedorID}
                                                {...register(`fields.[${index}].parFornecedorID`)}
                                            />

                                            <Grid item md={4}>
                                                {field.nomeCampo}
                                            </Grid>

                                            <Grid item md={3}>
                                                <Checkbox
                                                    name={`fields.[${index}].mostra`}
                                                    {...register(`fields.[${index}].mostra`)}
                                                    defaultChecked={fields[index].mostra == 1 ? true : false}
                                                />
                                            </Grid>

                                            <Grid item md={3}>
                                                <Checkbox
                                                    name={`fields.[${index}].obrigatorio`}
                                                    {...register(`fields.[${index}].obrigatorio`)}
                                                    defaultChecked={fields[index].obrigatorio == 1 ? true : false}
                                                />
                                            </Grid>
                                        </ListItemButton>
                                    </ListItem>
                                </>
                            ))}
                        </Grid>
                    </List>
                </CardContent>
            </form>
        </Card>
    )
}

export default FormParametrosFornecedor

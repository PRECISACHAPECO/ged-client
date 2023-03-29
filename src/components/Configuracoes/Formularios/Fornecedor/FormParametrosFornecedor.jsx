
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Switch,
    TextField,
    Typography
} from '@mui/material'
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
                // reset(response.data)
            })
        }
        getData()
    }, [])

    const {
        control,
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
                                            <Controller
                                                name={`fields.[${index}].parFornecedorID`}
                                                control={control}
                                                defaultValue={field.parFornecedorID}
                                                render={({ field: { value, onChange } }) => (
                                                    <input type='hidden' value={value} onChange={onChange} />
                                                )}
                                            />

                                            <Grid item md={4}>
                                                {field.nomeCampo}
                                            </Grid>

                                            <Grid item md={3}>
                                                <FormControl fullWidth>
                                                    <Controller
                                                        name={`fields.[${index}].mostra`}
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <FormControlLabel
                                                                checked={value == '1' ? true : false}
                                                                onChange={onChange}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                labelPlacement='left'
                                                                sx={{ mr: 8 }}
                                                                control={<Checkbox />}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            
                                            <Grid item md={3}>
                                                <FormControl fullWidth>
                                                    <Controller
                                                        name={`fields.[${index}].obrigatorio`}
                                                        control={control}
                                                        render={({ field: { value, onChange } }) => (
                                                            <FormControlLabel
                                                                checked={value == '1' ? true : false}
                                                                onChange={onChange}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                labelPlacement='left'
                                                                sx={{ mr: 8 }}
                                                                control={<Checkbox />}
                                                            />
                                                        )}
                                                    />
                                                </FormControl>
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

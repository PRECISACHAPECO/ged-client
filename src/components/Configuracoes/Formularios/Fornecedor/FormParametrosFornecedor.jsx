import React, { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Card, CardContent, Checkbox, Grid, List, ListItem, ListItemButton, Typography } from '@mui/material'
import Router from 'next/router'
import { backRoute } from 'src/configs/defaultConfigs'
import { api } from 'src/configs/api'
import FormHeader from 'src/components/FormHeader'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'

const FormParametrosFornecedor = () => {
    const { user } = useContext(AuthContext)

    const [headers, setHeaders] = useState([])
    const [blocks, setBlocks] = useState([])

    const router = Router
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const { setTitle } = useContext(ParametersContext)

    useEffect(() => {
        setTitle('Formulário do Fornecedor')

        // Obtem o cabeçalho do formulário
        const getHeader = () => {
            api.get(`${staticUrl}/fornecedor/${user.unidadeID}`, { headers: { 'function-name': 'getHeader' } }).then(
                response => {
                    console.log('getHeader: ', response.data)
                    setHeaders(response.data)
                }
            )
        }
        // Obtem os blocos do formulário
        const getBlocks = () => {
            api.get(`${staticUrl}/fornecedor/${user.unidadeID}`, { headers: { 'function-name': 'getBlocks' } }).then(
                response => {
                    console.log('getBlocks: ', response.data)
                    setBlocks(response.data)
                }
            )
        }
        getHeader()
        getBlocks()
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
            await api.put(`${staticUrl}/fornecedor/${user.unidadeID}`, data.headers).then(response => {
                console.log('editado: ', response.data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {/* Cabeçalho */}
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

                                {headers.map((header, index) => (
                                    <>
                                        <ListItem divider disablePadding>
                                            <ListItemButton>
                                                <input
                                                    type='hidden'
                                                    name={`headers.[${index}].parFornecedorID`}
                                                    defaultValue={header.parFornecedorID}
                                                    {...register(`headers.[${index}].parFornecedorID`)}
                                                />

                                                <Grid item md={4}>
                                                    {header.nomeCampo}
                                                </Grid>

                                                <Grid item md={3}>
                                                    <Checkbox
                                                        name={`headers.[${index}].mostra`}
                                                        {...register(`headers.[${index}].mostra`)}
                                                        defaultChecked={headers[index].mostra == 1 ? true : false}
                                                    />
                                                </Grid>

                                                <Grid item md={3}>
                                                    <Checkbox
                                                        name={`headers.[${index}].obrigatorio`}
                                                        {...register(`headers.[${index}].obrigatorio`)}
                                                        defaultChecked={headers[index].obrigatorio == 1 ? true : false}
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

            {/* Blocos */}
            <Box container>
                <Card>
                    <CardContent>
                        <p>Opa...</p>
                    </CardContent>
                </Card>
            </Box>
            <Box container>
                <Card>
                    <CardContent>
                        <p>Opa...</p>
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default FormParametrosFornecedor

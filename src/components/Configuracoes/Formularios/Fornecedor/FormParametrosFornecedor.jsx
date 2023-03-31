import { useState, useEffect, useContext } from 'react'

import { useForm } from 'react-hook-form'
import {
    Box,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    Grid,
    List,
    ListItem,
    ListItemButton,
    TextField,
    Typography
} from '@mui/material'
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
    } = useForm()

    const onSubmit = async data => {
        const dataForm = {
            header: data.headers,
            blocks: data.blocks
        }

        console.log('onSubmit: ', dataForm)

        // try {
        //     await api.put(`${staticUrl}/fornecedor/${user.unidadeID}`, data.headers).then(response => {
        //         console.log('editado: ', response.data)
        //     })
        // } catch (error) {
        //     console.log(error)
        // }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Cabeçalho */}
                <Card>
                    <FormHeader btnCancel btnSave handleSubmit={() => handleSubmit(onSubmit)} />
                    <CardContent>
                        {/* Lista campos */}
                        <List component='nav' aria-label='main mailbox'>
                            <Grid container spacing={2}>
                                {/* Cabeçalho */}
                                <ListItem divider disablePadding>
                                    <ListItemButton>
                                        <Grid item md={4}>
                                            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                Nome do Campo
                                            </Typography>
                                        </Grid>
                                        <Grid item md={3}>
                                            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                Mostra no Formulário
                                            </Typography>
                                        </Grid>
                                        <Grid item md={3}>
                                            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
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
                </Card>

                {/* Blocos */}
                {blocks &&
                    blocks.map((block, index) => (
                        <Card key={index} md={12} sx={{ mt: 4 }}>
                            <CardContent>
                                {/* Header */}
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={2}>
                                        <TextField
                                            label='Sequência'
                                            placeholder='Sequência'
                                            name={`blocks.[${index}].sequencia`}
                                            defaultValue={block.dados.ordem}
                                            {...register(`blocks.[${index}].sequencia`)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label='Nome do Bloco'
                                                placeholder='Nome do Bloco'
                                                name={`blocks.[${index}].nome`}
                                                defaultValue={block.dados.nome}
                                                {...register(`blocks.[${index}].nome`)}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={2}>
                                        <Typography variant='body2'>Observação</Typography>
                                        <Checkbox
                                            name={`blocks.[${index}].obs`}
                                            {...register(`blocks.[${index}].obs`)}
                                            defaultChecked={blocks[index].dados.obs == 1 ? true : false}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={2}>
                                        <Typography variant='body2'>Ativo</Typography>
                                        <Checkbox
                                            name={`blocks.[${index}].status`}
                                            {...register(`blocks.[${index}].status`)}
                                            defaultChecked={blocks[index].dados.status == 1 ? true : false}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={4}>
                                    {/* Atividade */}
                                    <Grid item xs={12} md={4}>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                    Mostrar esse bloco se atividade for:
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        {block.atividades &&
                                            block.atividades.map((atividade, indexAtividade) => (
                                                <ListItem key={indexAtividade} disablePadding>
                                                    <ListItemButton>
                                                        <Grid item md={1}>
                                                            <Checkbox
                                                                name={`blocks.[${index}][${indexAtividade}].atividade`}
                                                                {...register(
                                                                    `blocks.[${index}][${indexAtividade}].atividade`
                                                                )}
                                                                defaultChecked={atividade.checked == 1 ? true : false}
                                                            />
                                                        </Grid>

                                                        <Grid item md={11}>
                                                            {atividade.nome}
                                                        </Grid>
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                    </Grid>

                                    {/* Fabricante/Importador */}
                                    <Grid item xs={12} md={4}>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                    Mostrar esse bloco quando é:
                                                </Typography>
                                            </ListItemButton>
                                        </ListItem>
                                        {block.categrias &&
                                            block.categrias.map((categoria, indexCategoria) => (
                                                <ListItem key={indexCategoria} disablePadding>
                                                    <ListItemButton>
                                                        <Grid item md={1}>
                                                            <Checkbox
                                                                name={`blocks.[${index}][${indexCategoria}].categoria`}
                                                                {...register(
                                                                    `blocks.[${index}][${indexCategoria}].categoria`
                                                                )}
                                                                defaultChecked={categoria.checked == 1 ? true : false}
                                                            />
                                                        </Grid>

                                                        <Grid item md={11}>
                                                            {categoria.nome}
                                                        </Grid>
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
            </form>
        </>
    )
}

export default FormParametrosFornecedor

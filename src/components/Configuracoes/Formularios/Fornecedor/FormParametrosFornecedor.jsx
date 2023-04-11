import { useState, useEffect, useContext } from 'react'

import { useForm } from 'react-hook-form'
import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
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
import toast from 'react-hot-toast'
import { toastMessage } from 'src/configs/defaultConfigs'
import Loading from 'src/components/Loading'
import Icon from 'src/@core/components/icon'

const FormParametrosFornecedor = () => {
    const { user } = useContext(AuthContext)
    const [headers, setHeaders] = useState()
    const [optionsItens, setOptionsItens] = useState([])
    const [blocks, setBlocks] = useState()
    const [orientacoes, setOrientacoes] = useState()

    const router = Router
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const { setTitle } = useContext(ParametersContext)

    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const onSubmit = async data => {
        const dataForm = {
            header: data.headers,
            blocks: data.blocks,
            orientacoes: data.orientacoes
        }

        try {
            await api.put(`${staticUrl}/fornecedor/${user.unidadeID}`, dataForm).then(response => {
                toast.success(toastMessage.successUpdate)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const addItem = index => {
        const newBlock = [...blocks]
        newBlock[index].itens.push({
            ordem: newBlock[index].itens.length + 1,
            obs: 1,
            status: 1,
            obrigatorio: 1
        })
        setBlocks(newBlock)
    }

    const addBlock = () => {
        const newBlock = [...blocks]
        newBlock.push({
            dados: {
                ordem: newBlock.length + 1,
                nome: '',
                status: 1
            },
            atividades: [
                // Obter atividades do bloco 0 e inserir no novo bloco com todas as opções desmarcadas
                ...blocks[0].atividades.map(atividade => ({
                    ...atividade,
                    checked: 0
                }))
            ],
            categorias: [
                // Obter categorias do bloco 0 e inserir no novo bloco com todas as opções desmarcadas
                ...blocks[0].categorias.map(categoria => ({
                    ...categoria,
                    checked: 0
                }))
            ],
            itens: [
                // Obter primeiro item do primeiro bloco
                {
                    ordem: 1,
                    obs: 1,
                    status: 1,
                    obrigatorio: 1
                }
            ]
        })
        setBlocks(newBlock)
    }

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

        // Obtem as opções pra seleção da listagem dos selects de itens e alternativas
        const getOptionsItens = () => {
            api.get(`${staticUrl}/fornecedor/${user.unidadeID}`, {
                headers: { 'function-name': 'getOptionsItens' }
            }).then(response => {
                console.log('getOptionsItens: ', response.data)
                setOptionsItens(response.data)
            })
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

        // Obtem os blocos do formulário
        const getOrientacoes = () => {
            api.get(`${staticUrl}/fornecedor/${user.unidadeID}`, {
                headers: { 'function-name': 'getOrientacoes' }
            }).then(response => {
                console.log('getOrientacoes: ', response.data)
                setOrientacoes(response.data.obs)
            })
        }

        getHeader()
        getOptionsItens()
        getBlocks()
        getOrientacoes()
    }, [])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Cabeçalho */}
                {headers && (
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
                                            <ListItem key={index} divider disablePadding>
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
                                                            defaultChecked={
                                                                headers[index].obrigatorio == 1 ? true : false
                                                            }
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
                )}

                {/* Blocos */}
                {!blocks && <Loading />}
                {blocks &&
                    blocks.map((block, index) => (
                        <Card key={index} md={12} sx={{ mt: 4 }}>
                            <CardContent>
                                {/* Header */}
                                <input
                                    type='hidden'
                                    name={`blocks.[${index}].parFornecedorBlocoID`}
                                    defaultValue={block.dados.parFornecedorBlocoID}
                                    {...register(`blocks.[${index}].parFornecedorBlocoID`)}
                                />

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
                                        <Typography variant='body2'>Ativo</Typography>
                                        <Checkbox
                                            name={`blocks.[${index}].status`}
                                            {...register(`blocks.[${index}].status`)}
                                            defaultChecked={blocks[index].dados.status == 1 ? true : false}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={2}>
                                        <Typography variant='body2'>Observação</Typography>
                                        <Checkbox
                                            name={`blocks.[${index}].obs`}
                                            {...register(`blocks.[${index}].obs`)}
                                            defaultChecked={blocks[index].dados.obs == 1 ? true : false}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Atividades e Importador/Fabricante */}
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
                                                        <input
                                                            type='hidden'
                                                            name={`blocks.[${index}].atividades[${indexAtividade}].atividadeID`}
                                                            defaultValue={atividade.atividadeID}
                                                            {...register(
                                                                `blocks.[${index}].atividades[${indexAtividade}].atividadeID`
                                                            )}
                                                        />

                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    name={`blocks.[${index}].atividades[${indexAtividade}].checked`}
                                                                    {...register(
                                                                        `blocks.[${index}].atividades[${indexAtividade}].checked`
                                                                    )}
                                                                    defaultChecked={
                                                                        atividade.checked == 1 ? true : false
                                                                    }
                                                                />
                                                            }
                                                            label={atividade.nome}
                                                        />
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
                                        {block.categorias &&
                                            block.categorias.map((categoria, indexCategoria) => (
                                                <ListItem key={indexCategoria} disablePadding>
                                                    <ListItemButton>
                                                        <input
                                                            type='hidden'
                                                            name={`blocks.[${index}].categorias[${indexCategoria}].categoriaID`}
                                                            defaultValue={categoria.categoriaID}
                                                            {...register(
                                                                `blocks.[${index}].categorias[${indexCategoria}].categoriaID`
                                                            )}
                                                        />

                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    name={`blocks.[${index}].categorias[${indexCategoria}].checked`}
                                                                    {...register(
                                                                        `blocks.[${index}].categorias[${indexCategoria}].checked`
                                                                    )}
                                                                    defaultChecked={
                                                                        categoria.checked == 1 ? true : false
                                                                    }
                                                                />
                                                            }
                                                            label={categoria.nome}
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                            ))}
                                    </Grid>
                                </Grid>

                                {/* Itens */}
                                <Grid container spacing={4} sx={{ mt: 4 }}>
                                    {block.itens &&
                                        block.itens.map((item, indexItem) => (
                                            <>
                                                <input
                                                    type='hidden'
                                                    name={`blocks.[${index}].itens.[${indexItem}].parFornecedorBlocoItemID`}
                                                    defaultValue={item.parFornecedorBlocoItemID}
                                                    {...register(
                                                        `blocks.[${index}].itens.[${indexItem}].parFornecedorBlocoItemID`
                                                    )}
                                                />

                                                <Grid item xs={12} md={1}>
                                                    <FormControl fullWidth>
                                                        <TextField
                                                            label='Sequência'
                                                            placeholder='Sequência'
                                                            name={`blocks.[${index}].itens.[${indexItem}].sequencia`}
                                                            defaultValue={item.ordem}
                                                            {...register(
                                                                `blocks.[${index}].itens.[${indexItem}].sequencia`
                                                            )}
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <FormControl fullWidth>
                                                        {blocks[index].itens[indexItem].nome !== '' && (
                                                            <Autocomplete
                                                                options={optionsItens.itens}
                                                                defaultValue={blocks[index].itens[indexItem]}
                                                                id='autocomplete-outlined'
                                                                getOptionLabel={option => option.nome || ''}
                                                                onChange={(event, value) => {
                                                                    setValue(
                                                                        `blocks.[${index}].itens.[${indexItem}].itemID`,
                                                                        value?.itemID
                                                                    )
                                                                }}
                                                                renderInput={params => (
                                                                    <TextField
                                                                        {...params}
                                                                        name={`blocks.[${index}].itens.[${indexItem}].nome`}
                                                                        label='Item'
                                                                        placeholder='Item'
                                                                        {...register(
                                                                            `blocks.[${index}].itens.[${indexItem}].nome`
                                                                        )}
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} md={2}>
                                                    <FormControl fullWidth>
                                                        <Autocomplete
                                                            options={optionsItens.alternativas}
                                                            defaultValue={blocks[index].itens[indexItem]}
                                                            id='autocomplete-outlined'
                                                            getOptionLabel={option => option.alternativa || ''}
                                                            onChange={(event, value) => {
                                                                setValue(
                                                                    `blocks.[${index}].itens.[${indexItem}].alternativaID`,
                                                                    value?.alternativaID
                                                                )
                                                            }}
                                                            renderInput={params => (
                                                                <TextField
                                                                    {...params}
                                                                    name={`blocks.[${index}].itens.[${indexItem}].alternativa`}
                                                                    label='Alternativa'
                                                                    placeholder='Alternativa'
                                                                    {...register(
                                                                        `blocks.[${index}].itens.[${indexItem}].alternativa`
                                                                    )}
                                                                />
                                                            )}
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid item md={1}>
                                                    <Typography variant='body2'>
                                                        {indexItem == 0 ? 'Ativo' : ''}
                                                    </Typography>
                                                    <Checkbox
                                                        name={`blocks.[${index}][${indexItem}].status`}
                                                        {...register(`blocks.[${index}].itens.[${indexItem}].status`)}
                                                        defaultChecked={item.status == 1 ? true : false}
                                                    />
                                                </Grid>

                                                <Grid item md={1}>
                                                    <Typography variant='body2'>
                                                        {indexItem == 0 ? 'Obs' : ''}
                                                    </Typography>
                                                    <Checkbox
                                                        name={`blocks.[${index}][${indexItem}].obs`}
                                                        // disabled checkbox se blocks.[${index}][${indexItem}].status for false
                                                        disabled={item.status == 0 ? true : false}
                                                        {...register(`blocks.[${index}].itens.[${indexItem}].obs`)}
                                                        defaultChecked={item.obs == 1 ? true : false}
                                                    />
                                                </Grid>

                                                <Grid item md={1}>
                                                    <Typography variant='body2'>
                                                        {indexItem == 0 ? 'Obrigatório' : ''}
                                                    </Typography>
                                                    <Checkbox
                                                        name={`blocks.[${index}][${indexItem}].obrigatorio`}
                                                        {...register(
                                                            `blocks.[${index}].itens.[${indexItem}].obrigatorio`
                                                        )}
                                                        defaultChecked={item.obrigatorio == 1 ? true : false}
                                                    />
                                                </Grid>
                                            </>
                                        ))}

                                    {/* Botão inserir item */}
                                    <Grid item xs={12} md={12}>
                                        <Button
                                            variant='outlined'
                                            color='primary'
                                            startIcon={<Icon icon='material-symbols:add-circle-outline-rounded' />}
                                            onClick={() => {
                                                addItem(index)
                                            }}
                                        >
                                            Inserir Item
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}

                {/* Botão inserir bloco */}
                <Grid item xs={12} md={12} sx={{ mt: 4 }}>
                    <Button
                        variant='outlined'
                        color='primary'
                        startIcon={<Icon icon='material-symbols:add-circle-outline-rounded' />}
                        onClick={() => {
                            addBlock()
                        }}
                    >
                        Inserir Bloco
                    </Button>
                </Grid>

                {/* Orientações */}
                <Card md={12} sx={{ mt: 4 }}>
                    <CardContent>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    label='Orientações'
                                    placeholder='Orientações'
                                    rows={4}
                                    multiline
                                    fullWidth
                                    name={`orientacoes`}
                                    defaultValue={orientacoes ?? ''}
                                    {...register(`orientacoes`)}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </form>
        </>
    )
}

export default FormParametrosFornecedor

import { useState, useEffect, useContext } from 'react'

import { useForm } from 'react-hook-form'
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    TextField,
    Tooltip,
    Typography
} from '@mui/material'
import Router from 'next/router'
import { backRoute } from 'src/configs/defaultConfigs'
import { api } from 'src/configs/api'
import FormHeader from 'src/components/Defaults/FormHeader'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import toast from 'react-hot-toast'
import { toastMessage } from 'src/configs/defaultConfigs'
import Loading from 'src/components/Loading'
import Icon from 'src/@core/components/icon'
import DialogConfirmScore from 'src/components/Defaults/Dialogs/DialogConfirmScore'

const FormParametrosFornecedor = () => {
    const { user, loggedUnity } = useContext(AuthContext)
    const [headers, setHeaders] = useState()
    const [options, setOptions] = useState([])
    console.log('🚀 ~ options:', options)
    const [blocks, setBlocks] = useState()
    const [orientacoes, setOrientacoes] = useState()
    const [openModalConfirmScore, setOpenModalConfirmScore] = useState(false)
    const [itemScore, setItemScore] = useState()
    const [isLoading, setLoading] = useState(false)
    const [savingForm, setSavingForm] = useState(false)

    const router = Router
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const { setTitle } = useContext(ParametersContext)

    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const onSubmit = async values => {
        const data = {
            unidadeID: loggedUnity.unidadeID,
            header: values.headers,
            blocks: values.blocks,
            orientacoes: values.orientacoes
        }

        try {
            await api.put(`${staticUrl}/fornecedor/updateData`, data).then(response => {
                toast.success(toastMessage.successUpdate)
                setSavingForm(!savingForm)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const addItem = index => {
        if (index) {
            const newBlock = [...blocks]
            newBlock[index].itens.push({
                ordem: newBlock[index].itens?.length + 1,
                obs: 1,
                status: 1,
                obrigatorio: 1
            })
            setBlocks(newBlock)
        }
    }
    const removeItem = (item, indexBlock, indexItem) => {
        item.removed = true
        setValue(`blocks.[${indexBlock}].itens.[${indexItem}].removed`, true)

        document.getElementById(`item-${indexBlock}-${indexItem}`).style.display = 'none'
        toast.success('Item pré-removido, salve para concluir!')
    }

    //  Ao clicar no icone de pontuação, abre o modal de confirmação de pontuação e envia para o back o item selecionado
    const openScoreModal = item => {
        setItemScore(null)
        api.post(`/formularios/fornecedor/getItemScore`, { data: item }).then(response => {
            setItemScore(response.data)
        })
        if (setItemScore) {
            setOpenModalConfirmScore(true)
        }
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

    const initializeValues = values => {
        values.blocks.map((block, indexBlock) => {
            block.itens.map((item, indexItem) => {
                if (item) {
                    setValue(`blocks.[${indexBlock}].itens.[${indexItem}].item`, item.item)
                    setValue(`blocks.[${indexBlock}].itens.[${indexItem}].alternativa`, item.alternativa)
                }
            })
        })
    }

    const getData = () => {
        try {
            setLoading(true)
            api.post(`${staticUrl}/fornecedor/getData`, { unidadeID: loggedUnity.unidadeID }).then(response => {
                console.log('getdata', response.data)
                setHeaders(response.data.header)
                setBlocks(response.data.blocks)
                setOptions(response.data.options)
                setOrientacoes(response.data.orientations)

                initializeValues(response.data)
                setLoading(false)
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setTitle('Formulário do Fornecedor')
        getData()
    }, [savingForm])

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
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
                                                                defaultChecked={
                                                                    headers[index].mostra == 1 ? true : false
                                                                }
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
                                    <Grid container spacing={4} sx={{ mt: 2 }}>
                                        <Grid item xs={12} md={12}>
                                            <Alert severity='info'>
                                                Esse bloco será habilitado para o Fornecedor se satisfazer as condições
                                                abaixo:
                                            </Alert>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={4}>
                                        {/* Fabricante/Importador */}
                                        <Grid item xs={12} md={3}>
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
                                    </Grid>

                                    {/* Itens */}
                                    {block.itens &&
                                        block.itens.map((item, indexItem) => (
                                            <Grid
                                                id={`item-${index}-${indexItem}`}
                                                key={indexItem}
                                                container
                                                spacing={4}
                                                sx={{ mt: 4 }}
                                            >
                                                <input
                                                    type='hidden'
                                                    name={`blocks.[${index}].itens.[${indexItem}].parFornecedorBlocoItemID`}
                                                    defaultValue={item.parFornecedorBlocoItemID}
                                                    {...register(
                                                        `blocks.[${index}].itens.[${indexItem}].parFornecedorBlocoItemID`
                                                    )}
                                                />

                                                <Grid item xs={12} md={1} sx={{ textAlign: 'right' }}>
                                                    <FormControl>
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

                                                <Grid item xs={12} md={4}>
                                                    <FormControl fullWidth>
                                                        {blocks[index].itens[indexItem].nome !== '' && (
                                                            <Autocomplete
                                                                options={blocks[index].optionsBlock?.itens.filter(
                                                                    option =>
                                                                        blocks[index].itens.every(
                                                                            item => item.item?.nome !== option.nome
                                                                        ) &&
                                                                        option.nome !==
                                                                            blocks[index].itens[indexItem]?.item?.nome
                                                                )}
                                                                getOptionLabel={optionsBlock => optionsBlock.nome}
                                                                defaultValue={
                                                                    blocks[index].itens[indexItem].item ?? { nome: '' }
                                                                }
                                                                disabled={
                                                                    blocks[index].itens[indexItem].hasPending === 1 ||
                                                                    blocks[index].itens[indexItem].status === 0
                                                                }
                                                                name={`blocks.[${index}].itens.[${indexItem}].item`}
                                                                {...register(
                                                                    `blocks.[${index}].itens.[${indexItem}].item`,
                                                                    {
                                                                        required: true
                                                                    }
                                                                )}
                                                                onChange={(event, value) => {
                                                                    const newValue = value ?? null
                                                                    setValue(
                                                                        `blocks.[${index}].itens.[${indexItem}].item`,
                                                                        newValue
                                                                    )

                                                                    //! Modificar o array de options para remover o newValue dos itens
                                                                    blocks[index].optionsBlock.itens = blocks[
                                                                        index
                                                                    ].optionsBlock.itens.filter(
                                                                        option => option.nome !== newValue?.nome
                                                                    )

                                                                    //! Adicionar o item removido de volta ao array de options
                                                                    if (blocks[index].itens[indexItem].item) {
                                                                        blocks[index].optionsBlock.itens.push(
                                                                            blocks[index].itens[indexItem].item
                                                                        )
                                                                    }
                                                                }}
                                                                renderInput={params => (
                                                                    <TextField
                                                                        {...params}
                                                                        label={
                                                                            blocks[index].itens[indexItem].itemID
                                                                                ? `Item [${blocks[index].itens[indexItem].itemID}]`
                                                                                : 'Item'
                                                                        }
                                                                        placeholder={
                                                                            blocks[index].itens[indexItem].itemID
                                                                                ? `Item [${blocks[index].itens[indexItem].itemID}]`
                                                                                : 'Item'
                                                                        }
                                                                        error={
                                                                            errors?.blocks?.[index]?.itens[indexItem]
                                                                                ?.item
                                                                        }
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} md={2}>
                                                    <FormControl fullWidth>
                                                        <Autocomplete
                                                            options={options.alternativas}
                                                            getOptionLabel={option => option.nome || ''}
                                                            defaultValue={
                                                                blocks[index].itens[indexItem].alternativa ?? {
                                                                    nome: ''
                                                                }
                                                            }
                                                            disabled={item.hasPending == 1 || item.status == 0}
                                                            name={`blocks.[${index}].itens.[${indexItem}].alternativa`}
                                                            {...register(
                                                                `blocks.[${index}].itens.[${indexItem}].alternativa`,
                                                                { required: true }
                                                            )}
                                                            onChange={(event, value) => {
                                                                const newValue = value ?? null
                                                                setValue(
                                                                    `blocks.[${index}].itens.[${indexItem}].alternativa`,
                                                                    newValue
                                                                )
                                                            }}
                                                            renderInput={params => (
                                                                <TextField
                                                                    {...params}
                                                                    label='Alternativa'
                                                                    placeholder='Alternativa'
                                                                    error={
                                                                        errors?.blocks?.[index]?.itens[indexItem]
                                                                            ?.alternativa
                                                                    }
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
                                                        disabled={item.status == 0 ? true : false}
                                                        name={`blocks.[${index}][${indexItem}].obs`}
                                                        {...register(`blocks.[${index}].itens.[${indexItem}].obs`)}
                                                        defaultChecked={item.obs == 1 ? true : false}
                                                    />
                                                </Grid>

                                                <Grid item md={1}>
                                                    <Typography variant='body2'>
                                                        {indexItem == 0 ? 'Obrigatório' : ''}
                                                    </Typography>
                                                    <Checkbox
                                                        disabled={item.status == 0 ? true : false}
                                                        name={`blocks.[${index}][${indexItem}].obrigatorio`}
                                                        {...register(
                                                            `blocks.[${index}].itens.[${indexItem}].obrigatorio`
                                                        )}
                                                        defaultChecked={item.obrigatorio == 1 ? true : false}
                                                    />
                                                </Grid>
                                                {/* Abre o modal que define a pontuação das respostas */}
                                                <Grid item md={1}>
                                                    <Typography variant='body2'>
                                                        {indexItem == 0 ? 'Pontuação' : ''}
                                                    </Typography>
                                                    <Button
                                                        style={item.pontuacao === 0 ? { opacity: 0.3 } : {}}
                                                        title={
                                                            !item.parFornecedorBlocoID
                                                                ? 'Salve o bloco para definir a pontuação'
                                                                : 'Definir pontuação para as respostas'
                                                        }
                                                        disabled={!item.parFornecedorBlocoID}
                                                        onClick={() => openScoreModal(item)}
                                                    >
                                                        <Icon icon='ic:baseline-assessment' />
                                                    </Button>
                                                </Grid>

                                                {/* Deletar */}
                                                <Grid item md={1}>
                                                    <Typography variant='body2'>
                                                        {indexItem == 0 ? 'Remover' : ''}
                                                    </Typography>
                                                    <Tooltip
                                                        title={
                                                            item.hasPending == 1
                                                                ? `Este item não pode mais ser removido pois já foi respondido em um formulário`
                                                                : `Remover este item`
                                                        }
                                                    >
                                                        <IconButton
                                                            color='error'
                                                            onClick={() => {
                                                                item.hasPending == 1
                                                                    ? null
                                                                    : removeItem(item, index, indexItem)
                                                            }}
                                                            sx={{
                                                                opacity: item.hasPending == 1 ? 0.5 : 1,
                                                                cursor: item.hasPending == 1 ? 'default' : 'pointer'
                                                            }}
                                                        >
                                                            <Icon icon='tabler:trash-filled' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        ))}
                                    {/* Modal que define a pontuação das respostas */}
                                    {openModalConfirmScore && itemScore && (
                                        <DialogConfirmScore
                                            openModal={openModalConfirmScore}
                                            setOpenModalConfirmScore={setOpenModalConfirmScore}
                                            itemScore={itemScore}
                                            setItemScore={setItemScore}
                                        />
                                    )}

                                    {/* Botão inserir item */}
                                    <Grid container spacing={4} sx={{ mt: 4 }}>
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
                                        defaultValue={orientacoes?.obs ?? ''}
                                        {...register(`orientacoes`)}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </form>
            )}
        </>
    )
}

export default FormParametrosFornecedor

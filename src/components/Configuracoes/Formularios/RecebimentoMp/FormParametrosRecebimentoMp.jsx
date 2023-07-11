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
import FormHeader from 'src/components/Defaults/FormHeader'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import toast from 'react-hot-toast'
import { toastMessage } from 'src/configs/defaultConfigs'
import Loading from 'src/components/Loading'
import Icon from 'src/@core/components/icon'

//* Custom components
import Select from 'src/components/Form/Select'
import Input from 'src/components/Form/Input'
import Check from 'src/components/Form/Check'
import CheckLabel from 'src/components/Form/CheckLabel'
import Remove from 'src/components/Form/Remove'

const FormParametrosRecebimentoMp = () => {
    const { user, loggedUnity } = useContext(AuthContext)
    const [headers, setHeaders] = useState()
    const [products, setProducts] = useState()
    const [options, setOptions] = useState(null)
    const [blocks, setBlocks] = useState([])
    const [orientacoes, setOrientacoes] = useState(null)
    const [savingForm, setSavingForm] = useState(false)
    const [arrRemovedItems, setArrRemovedItems] = useState([])

    const router = Router
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const { setTitle } = useContext(ParametersContext)

    const {
        setValue,
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm()

    // const initializeValues = values => {
    //     values.blocks.map((block, indexBlock) => {
    //         block.itens.map((item, indexItem) => {
    //             if (item) {
    //                 setValue(`blocks.[${indexBlock}].itens.[${indexItem}].item`, item.item)
    //                 setValue(`blocks.[${indexBlock}].itens.[${indexItem}].alternativa`, item.alternativa)
    //             }
    //         })
    //     })
    // }

    const onSubmit = async values => {
        const data = {
            unidadeID: loggedUnity.unidadeID,
            header: values.header,
            products: values.products,
            blocks: values.blocks,
            arrRemovedItems: arrRemovedItems,
            orientacoes: values.orientacoes
        }

        setHeaders(null) //? Pra exibir loading

        console.log('onSubmit: ', data)

        try {
            await api.put(`${staticUrl}/recebimentoMp/updateData`, data).then(response => {
                toast.success(toastMessage.successUpdate)
                setSavingForm(!savingForm)
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

        refreshOptions(newBlock[index], index, blocks, options)
    }

    const addBlock = () => {
        const newBlock = [...blocks]
        newBlock.push({
            dados: {
                ordem: newBlock.length + 1,
                nome: '',
                status: 1
            },
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

    const getData = () => {
        try {
            api.post(`${staticUrl}/recebimentoMp/getData`, { unidadeID: loggedUnity.unidadeID }).then(response => {
                console.log('getData: ', response.data)

                //* Estados
                setHeaders(response.data.header)
                setProducts(response.data.products)
                setBlocks(response.data.blocks)
                setOrientacoes(response.data.orientacoes.obs)
                setOptions(response.data.options)

                //* Insere os dados no formulário
                reset(response.data)

                setTimeout(() => {
                    response.data.blocks.map((block, indexBlock) => {
                        refreshOptions(block, indexBlock, response.data.blocks, response.data.options)
                    })
                }, 3000)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const removeItem = (item, indexBlock, indexItem) => {
        console.log('🚀 ~ length:', blocks[indexBlock].itens.length)
        if (blocks[indexBlock].itens.length === 1) {
            toast.error('Você deve ter ao menos um item!')
            return
        }
        // Inserir no array de itens removidos
        let newRemovedItems = [...arrRemovedItems]
        newRemovedItems.push(item)
        setArrRemovedItems(newRemovedItems)
        // Remove item do bloco
        const updatedBlocks = [...blocks]
        const newBlock = [...blocks[indexBlock].itens]
        newBlock.splice(indexItem, 1)
        updatedBlocks[indexBlock].itens = newBlock
        setBlocks(updatedBlocks)
        console.log('🚀 ~ newBlock:', newBlock)
        setValue(`blocks.[${indexBlock}].itens`, newBlock) //* Remove item do formulário
        refreshOptions(blocks[indexBlock], indexBlock, blocks, options)
    }

    const refreshOptions = (block, index, blocks, allOptions) => {
        let tempOptions = allOptions.itens

        //? Verifica se a opção está presente nos itens selecionados do bloco
        tempOptions = tempOptions.filter(option => {
            const isSelected = block.itens.some(i => i.item && option.id === i.item.id)
            return !isSelected // Retorna true para manter a opção, false para remover
        })

        // Atualiza block.optionsBlock do bloco
        let newBlock = [...blocks]
        newBlock[index].optionsBlock.itens = tempOptions
        setBlocks(newBlock)
    }

    useEffect(() => {
        setTitle('Formulário do Recebimento de MP')
        getData()
    }, [savingForm])

    console.log('errors: ', errors)

    return (
        <>
            {!headers ? (
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

                                        {headers.map((header, index) => (
                                            <>
                                                <input
                                                    type='hidden'
                                                    name={`header.[${index}].parRecebimentompID`}
                                                    defaultValue={header.parRecebimentompID}
                                                    {...register(`headers.[${index}].parRecebimentompID`)}
                                                />

                                                <Grid item md={4}>
                                                    {header.nomeCampo}
                                                </Grid>

                                                <CheckLabel
                                                    xs={12}
                                                    md={3}
                                                    title=''
                                                    name={`header.[${index}].mostra`}
                                                    value={header.mostra}
                                                    register={register}
                                                />

                                                <CheckLabel
                                                    xs={12}
                                                    md={3}
                                                    title=''
                                                    name={`header.[${index}].obrigatorio`}
                                                    value={header.obrigatorio}
                                                    register={register}
                                                />
                                            </>
                                        ))}
                                    </Grid>
                                </List>
                            </CardContent>
                        </Card>
                    )}

                    {/* Produtos */}
                    {products && (
                        <Card sx={{ mt: 4 }}>
                            <CardContent>
                                {/* Lista campos */}
                                <List component='nav' aria-label='main mailbox'>
                                    <Grid container spacing={2}>
                                        {/* Cabeçalho */}
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

                                        {products.map((product, index) => (
                                            <>
                                                <input
                                                    type='hidden'
                                                    name={`products.[${index}].parRecebimentoMpProdutoID`}
                                                    defaultValue={product.parRecebimentompProdutoID}
                                                    {...register(`products.[${index}].parRecebimentoMpProdutoID`)}
                                                />

                                                <Grid item md={4}>
                                                    {product.nomeCampo}
                                                </Grid>

                                                <CheckLabel
                                                    xs={12}
                                                    md={3}
                                                    title=''
                                                    name={`products.[${index}].mostra`}
                                                    value={product.mostra}
                                                    register={register}
                                                />

                                                <CheckLabel
                                                    xs={12}
                                                    md={3}
                                                    title=''
                                                    name={`products.[${index}].obrigatorio`}
                                                    value={product.obrigatorio}
                                                    register={register}
                                                />
                                            </>
                                        ))}
                                    </Grid>
                                </List>
                            </CardContent>
                        </Card>
                    )}

                    {/* Blocos */}
                    {blocks &&
                        blocks.map((block, index) => (
                            <Card key={index} md={12} sx={{ mt: 4 }}>
                                <CardContent>
                                    <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 4 }}>
                                        {`Bloco ${index + 1}`}
                                    </Typography>
                                    {/* Header */}
                                    <input
                                        type='hidden'
                                        name={`blocks.[${index}].parRecebimentompBlocoID`}
                                        defaultValue={block.dados.parRecebimentompBlocoID}
                                        {...register(`blocks.[${index}].parRecebimentompBlocoID`)}
                                    />

                                    <Grid container spacing={4}>
                                        <Input
                                            xs={12}
                                            md={1}
                                            title='Sequência'
                                            name={`blocks.[${index}].dados.ordem`}
                                            value={block.dados.ordem}
                                            required={true}
                                            register={register}
                                            errors={errors?.blocks?.[index]?.dados?.ordem}
                                        />

                                        <Input
                                            xs={12}
                                            md={9}
                                            title='Nome do Bloco'
                                            name={`blocks.[${index}].dados.nome`}
                                            value={block.dados.nome}
                                            required={true}
                                            register={register}
                                            errors={errors?.blocks?.[index]?.dados?.nome}
                                        />

                                        <Check
                                            xs={12}
                                            md={1}
                                            title='Ativo'
                                            name={`blocks.[${index}].dados.status`}
                                            value={blocks[index].dados.status}
                                            register={register}
                                        />

                                        <Check
                                            xs={12}
                                            md={1}
                                            title='Observação'
                                            name={`blocks.[${index}].dados.obs`}
                                            value={blocks[index].dados.obs}
                                            register={register}
                                        />
                                    </Grid>

                                    {/* Itens */}
                                    <Grid container spacing={4} sx={{ mt: 0 }}>
                                        <Grid item xs={12} md={12}>
                                            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                                                {`Itens`}
                                            </Typography>
                                        </Grid>
                                        {block.itens &&
                                            block.itens.map((item, indexItem) => (
                                                <>
                                                    <input
                                                        type='hidden'
                                                        name={`blocks.[${index}].itens.[${indexItem}].parRecebimentompBlocoItemID`}
                                                        defaultValue={item.parRecebimentompBlocoItemID}
                                                        {...register(
                                                            `blocks.[${index}].itens.[${indexItem}].parRecebimentompBlocoItemID`
                                                        )}
                                                    />

                                                    <Input
                                                        xs={12}
                                                        md={1}
                                                        title='Sequência'
                                                        name={`blocks.[${index}].itens.[${indexItem}].ordem`}
                                                        value={item.ordem}
                                                        required={true}
                                                        register={register}
                                                        errors={errors?.blocks?.[index]?.itens?.[indexItem]?.ordem}
                                                    />

                                                    <Select
                                                        xs={12}
                                                        md={5}
                                                        title={
                                                            blocks[index].itens[indexItem].itemID
                                                                ? `Item [${blocks[index].itens[indexItem].itemID}]`
                                                                : 'Item'
                                                        }
                                                        name={`blocks.[${index}].itens.[${indexItem}].item`}
                                                        value={blocks[index].itens[indexItem].item ?? null}
                                                        required={true}
                                                        // options={block.optionsBlock.itens.map(row => {
                                                        //     const isSelected = block.itens.some(i => {
                                                        //         i.item && row.id == i.item.id
                                                        //     })
                                                        //     return !isSelected ? row : null
                                                        // })}
                                                        options={options.itens}
                                                        register={register}
                                                        setValue={setValue}
                                                        errors={errors?.blocks?.[index]?.itens?.[indexItem]?.item}
                                                    />

                                                    <Select
                                                        xs={12}
                                                        md={2}
                                                        title='Alternativa'
                                                        name={`blocks.[${index}].itens.[${indexItem}].alternativa`}
                                                        value={blocks[index].itens[indexItem].alternativa ?? null}
                                                        required={true}
                                                        options={options.alternativas}
                                                        register={register}
                                                        setValue={setValue}
                                                        errors={
                                                            errors?.blocks?.[index]?.itens?.[indexItem]?.alternativa
                                                        }
                                                    />

                                                    <Check
                                                        xs={12}
                                                        md={1}
                                                        title='Ativo'
                                                        index={indexItem}
                                                        name={`blocks.[${index}].itens.[${indexItem}].status`}
                                                        value={blocks[index].itens[indexItem].status}
                                                        register={register}
                                                    />

                                                    <Check
                                                        xs={12}
                                                        md={1}
                                                        title='Obs'
                                                        index={indexItem}
                                                        name={`blocks.[${index}].itens.[${indexItem}].obs`}
                                                        value={blocks[index].itens[indexItem].obs}
                                                        register={register}
                                                    />

                                                    <Check
                                                        xs={12}
                                                        md={1}
                                                        title='Obrigatório'
                                                        index={indexItem}
                                                        name={`blocks.[${index}].itens.[${indexItem}].obrigatorio`}
                                                        value={blocks[index].itens[indexItem].obrigatorio}
                                                        register={register}
                                                    />

                                                    <Remove
                                                        xs={12}
                                                        md={1}
                                                        title={indexItem == 0 ? 'Remover' : ''}
                                                        index={index}
                                                        removeItem={removeItem}
                                                        item={item}
                                                        pending={item.hasPending}
                                                        textSuccess='Remover este item'
                                                        textError='Este item não pode mais ser removido pois já foi respondido em um formulário'
                                                    />
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
                    {headers && (
                        <Card md={12} sx={{ mt: 4 }}>
                            <CardContent>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={12}>
                                        <Input
                                            xs={12}
                                            md={12}
                                            title='Orientações'
                                            name={`orientacoes.obs`}
                                            required={false}
                                            value={orientacoes?.obs}
                                            multiline
                                            rows={4}
                                            register={register}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}
                </form>
            )}
        </>
    )
}

export default FormParametrosRecebimentoMp

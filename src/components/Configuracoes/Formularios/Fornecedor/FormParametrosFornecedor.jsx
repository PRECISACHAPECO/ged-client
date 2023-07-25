import { useState, useEffect, useContext } from 'react'

import { useForm } from 'react-hook-form'
import { Box, Button, Card, CardContent, Grid, List, Typography } from '@mui/material'
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

//* Custom components
import Select from 'src/components/Form/Select'
import Input from 'src/components/Form/Input'
import Check from 'src/components/Form/Check'
import CheckLabel from 'src/components/Form/CheckLabel'
import Remove from 'src/components/Form/Remove'

const FormParametrosFornecedor = () => {
    const { user, loggedUnity } = useContext(AuthContext)
    const [headers, setHeaders] = useState()
    const [allOptions, setAllOptions] = useState(null)
    const [blocks, setBlocks] = useState()
    const [orientacoes, setOrientacoes] = useState()
    const [openModalConfirmScore, setOpenModalConfirmScore] = useState(false)
    const [itemScore, setItemScore] = useState()
    const [savingForm, setSavingForm] = useState(false)
    const [arrRemovedItems, setArrRemovedItems] = useState([])

    const router = Router
    const staticUrl = backRoute(router.pathname) // Url sem ID
    const { setTitle } = useContext(ParametersContext)

    const {
        setValue,
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm()

    const onSubmit = async values => {
        const data = {
            unidadeID: loggedUnity.unidadeID,
            header: values.header,
            blocks: values.blocks,
            arrRemovedItems: arrRemovedItems,
            orientacoes: values.orientations
        }

        setHeaders(null) //? Pra exibir loading

        console.log('🚀 ~ onSubmit:', data)

        try {
            await api.put(`${staticUrl}/fornecedor/updateData`, data).then(response => {
                toast.success(toastMessage.successUpdate)
                setSavingForm(!savingForm)
            })
        } catch (error) {
            console.log(error)
        }
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

    const addItem = index => {
        // setChangeItem(!changeItem)
        const newBlock = [...blocks]

        newBlock[index].itens.push({
            ordem: newBlock[index].itens?.length + 1,
            obs: 1,
            status: 1,
            obrigatorio: 1
        })
        setBlocks(newBlock)

        setValue(`blocks.[${index}].itens.[${newBlock[index].itens.length - 1}].new`, true)

        refreshOptions(newBlock[index], index, blocks, allOptions)
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

        refreshOptions(blocks[indexBlock], indexBlock, blocks, allOptions)
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
            categorias: [],
            atividades: [],
            optionsBlock: {
                itens: [...allOptions.itens],
                alternativas: [...allOptions.alternativas]
            },
            itens: [
                {
                    parFormularioID: 1,
                    new: true,
                    ordem: '1',
                    nome: '',
                    status: 1,
                    item: null,
                    alternativa: null
                }
            ]
        })
        setBlocks(newBlock)
    }

    const getData = () => {
        try {
            api.post(`${staticUrl}/fornecedor/getData`, { unidadeID: loggedUnity.unidadeID }).then(response => {
                console.log('getdata', response.data)

                //* Estados
                setHeaders(response.data.header)
                setBlocks(response.data.blocks)
                setAllOptions({
                    categorias: response.data.options.categorias,
                    atividades: response.data.options.atividades,
                    itens: response.data.options.itens,
                    alternativas: response.data.options.alternativas
                })
                setOrientacoes(response.data.orientations)

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

    useEffect(() => {
        setTitle('Formulário do Fornecedor')
        getData()
    }, [savingForm])

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
                                                    name={`header.[${index}].parFornecedorID`}
                                                    defaultValue={header.parFornecedorID}
                                                    {...register(`header.[${index}].parFornecedorID`)}
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

                    {/* Blocos */}
                    {!blocks && <Loading />}
                    {blocks &&
                        blocks.map((block, index) => (
                            <Card key={index} md={12} sx={{ mt: 4 }}>
                                <CardContent>
                                    {/* Header */}
                                    <input
                                        type='hidden'
                                        name={`blocks.[${index}].dados.parFornecedorBlocoID`}
                                        value={block.dados.parFornecedorBlocoID}
                                        {...register(`blocks.[${index}].dados.parFornecedorBlocoID`)}
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

                                        {/* Configurações de exibição */}
                                        <Select
                                            xs={12}
                                            md={5}
                                            multiple
                                            title='Mostrar esse bloco quando é'
                                            name={`blocks.[${index}].categorias`}
                                            value={block.categorias}
                                            required={true}
                                            options={allOptions.categorias}
                                            register={register}
                                            control={control}
                                            setValue={setValue}
                                            errors={errors?.blocks?.[index]?.categorias}
                                        />

                                        <Select
                                            xs={12}
                                            md={7}
                                            multiple
                                            title='Atividade(s)'
                                            name={`blocks.[${index}].atividades`}
                                            value={block.atividades}
                                            required={false}
                                            options={allOptions.atividades}
                                            register={register}
                                            control={control}
                                            setValue={setValue}
                                            errors={errors?.blocks?.[index]?.atividades}
                                        />
                                    </Grid>

                                    {/* Itens */}
                                    <Typography variant='subtitle1' sx={{ fontWeight: 600, mt: 4 }}>
                                        Itens
                                    </Typography>
                                    {block.itens &&
                                        block.itens.map((item, indexItem) => (
                                            <Grid
                                                id={`item-${index}-${indexItem}`}
                                                key={indexItem}
                                                container
                                                spacing={2}
                                                sx={{ my: 1 }}
                                            >
                                                <input
                                                    type='hidden'
                                                    name={`blocks.[${index}].itens.[${indexItem}].parFornecedorBlocoItemID`}
                                                    value={item.parFornecedorBlocoItemID}
                                                    {...register(
                                                        `blocks.[${index}].itens.[${indexItem}].parFornecedorBlocoItemID`
                                                    )}
                                                />

                                                {/* Sequência do item */}
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

                                                {/* Item */}
                                                <Select
                                                    xs={12}
                                                    md={4}
                                                    title={
                                                        blocks[index].itens[indexItem].itemID
                                                            ? `Item [${blocks[index].itens[indexItem].itemID}]`
                                                            : 'Item'
                                                    }
                                                    name={`blocks.[${index}].itens.[${indexItem}].item`}
                                                    value={blocks[index].itens[indexItem].item ?? null}
                                                    required={true}
                                                    options={blocks[index].optionsBlock?.itens}
                                                    register={register}
                                                    control={control}
                                                    setValue={setValue}
                                                    errors={errors?.blocks?.[index]?.itens?.[indexItem]?.item}
                                                />

                                                {/* Alternativa do item */}
                                                <Select
                                                    xs={12}
                                                    md={2}
                                                    title='Alternativa'
                                                    name={`blocks.[${index}].itens.[${indexItem}].alternativa`}
                                                    value={blocks[index].itens[indexItem].alternativa ?? null}
                                                    required={true}
                                                    options={allOptions.alternativas}
                                                    register={register}
                                                    control={control}
                                                    setValue={setValue}
                                                    errors={errors?.blocks?.[index]?.itens?.[indexItem]?.alternativa}
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

                                                {/* Abre o modal que define a pontuação das respostas */}
                                                <Grid item xs={12} md={1}>
                                                    <Box
                                                        height='100%'
                                                        display='flex'
                                                        flexDirection='column'
                                                        justifyContent='center'
                                                        alignItems='center'
                                                    >
                                                        <Typography variant='caption'>
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
                                                    </Box>
                                                </Grid>

                                                {/* Deletar */}
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
                    {orientacoes && (
                        <Card md={12} sx={{ mt: 4 }}>
                            <CardContent>
                                <Grid container spacing={4}>
                                    <Input
                                        xs={12}
                                        md={12}
                                        title='Orientações'
                                        name={`orientations.obs`}
                                        required={false}
                                        value={orientacoes?.obs}
                                        multiline
                                        rows={4}
                                        register={register}
                                    />
                                </Grid>
                            </CardContent>
                        </Card>
                    )}
                </form>
            )}
        </>
    )
}

export default FormParametrosFornecedor

import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import TableFilter from 'src/views/table/data-grid/TableFilter'
import { CardContent } from '@mui/material'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import DialogNewFornecedor from 'src/components/Defaults/Dialogs/DialogNewFornecedor'
import { toast } from 'react-hot-toast'

import Loading from 'src/components/Loading'

// ** Next
import { useRouter } from 'next/router'

// ** Configs
import { configColumns } from 'src/configs/defaultConfigs'
import { Card } from '@mui/material'

const Fornecedor = () => {
    const { user, loggedUnity } = useContext(AuthContext)
    const [result, setResult] = useState(null)
    const router = useRouter()
    const currentLink = router.pathname
    const { setTitle } = useContext(ParametersContext)
    const [open, setOpen] = useState(false)
    const [loadingSave, setLoadingSave] = useState(false) //? Dependencia do useEffect pra atualizar listagem ao salvar

    //* Controles modal pra inserir fornecedor
    const openModal = () => {
        setOpen(true)
    }

<<<<<<< HEAD
    useEffect(() => {
        const getList = async () => {
            await api
                .post(`${currentLink}/getList`, {
                    unidadeID: loggedUnity.unidadeID,
                    papelID: user.papelID,
                    cnpj: user.cnpj ? user.cnpj : null
                })
                .then(response => {
                    setResult(response.data)
                    setTitle('Fornecedor')
                })
        }
=======
    const makeFornecedor = async (cnpj, email) => {
        console.log('🚀 ~ makeFornecedor ~ cnpj, email:', cnpj, email)
        // setLoading(true)
        try {
            setLoadingSave(true)
            await api
                .post(`/formularios/fornecedor/makeFornecedor`, {
                    usuarioID: user.usuarioID,
                    unidadeID: loggedUnity.unidadeID,
                    papelID: user.papelID,
                    cnpj: cnpj
                })
                .then(response => {
                    if (response.status === 200) {
                        // setData(response.data)
                        toast.success('Fornecedor habilitado com sucesso')
                        console.log('tornou um fornecedor.....')
                        // if (email) {
                        //     console.log('🚀 enviando email para ', email)
                        //     sendMail(email)
                        // }
                        // setCnpj(null)
                        // setEmail(null)
                    } else {
                        toast.error('Erro ao tornar fornecedor')
                    }
                    setLoadingSave(false)
                    // setLoading(false)
                    // setOpenConfirmMakeFornecedor(false) // Fecha modal de confirmação
                })
        } catch (error) {
            console.log(error)
        }
    }

    //* Controles da listagem
    const getList = async () => {
        await api
            .post(`${currentLink}/getList`, {
                unidadeID: loggedUnity.unidadeID,
                papelID: user.papelID,
                cnpj: user.cnpj ? user.cnpj : null
            })
            .then(response => {
                setResult(response.data)
                setTitle('Fornecedor')
            })
    }

    useEffect(() => {
        console.log('useEffect da listagem...')
>>>>>>> ea101e8aaec865ac61ad11a23b637caf8f06b69c
        getList()
    }, [loadingSave])

    console.log('dados do bakc', result)

    const arrColumns = [
        {
            title: 'ID',
            field: 'id',
            size: 0.1
        },
        {
            title: 'Fantasia',
            field: 'fantasia',
            size: 0.4
        },
        {
            title: 'Fábrica',
            field: 'fabrica',
            size: 0.2
        },
        {
            title: 'Cidade',
            field: 'cidade',
            size: 0.2
        },
        {
            title: 'UF',
            field: 'estado',
            size: 0.1
        },
        {
            title: 'Status',
            field: 'status',
            size: 0.2
        }
    ]

    const columns = configColumns(currentLink, arrColumns)

    return (
        <>
            {!result && <Loading />}
            {result && (
                <>
                    <Card>
                        <CardContent sx={{ pt: '0' }}>
                            <TableFilter
                                rows={result}
                                columns={columns}
                                buttonsHeader={{
                                    btnNew: user.papelID == 1 ? true : false,
                                    btnPrint: true,
                                    openModal: user.papelID == 1 ? openModal : null
                                }}
                            />
                        </CardContent>
                    </Card>
                </>
            )}

            <DialogNewFornecedor
                title='Excluir dado'
                text='Tem certeza que deseja excluir?'
                openModal={open}
                handleClose={() => setOpen(false)}
                makeFornecedor={makeFornecedor}
                btnCancel
                btnConfirm
                loadingSave={loadingSave}
            />
        </>
    )
}

export default Fornecedor

import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import TableFilter from 'src/views/table/data-grid/TableFilter'
import { CardContent } from '@mui/material'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import DialogNewFornecedor from 'src/components/Defaults/Dialogs/DialogNewFornecedor'
import { validationCNPJ, validationEmail } from '../../../configs/validations'
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

    console.log('result: ', result)

    //* Controles modal pra inserir fornecedor
    const openModal = () => {
        setOpen(true)
    }

    const makeFornecedor = async (cnpj, email) => {
        try {
            setLoadingSave(true)
            await api
                .post(`${currentLink}/makeFornecedor`, {
                    usuarioID: user.usuarioID,
                    unidadeID: loggedUnity.unidadeID,
                    papelID: user.papelID,
                    cnpj: cnpj
                })
                .then(response => {
                    if (response.status === 200) {
                        toast.success('Fornecedor habilitado com sucesso')
                        console.log('tornou um fornecedor.....')
                        if (email) {
                            sendMail(email, cnpj)
                        }
                    } else {
                        toast.error('Erro ao tornar fornecedor')
                    }
                    setLoadingSave(false)
                })
        } catch (error) {
            console.log(error)
        }
    }

    const sendMail = (email, cnpj) => {
        if (email && validationEmail(email)) {
            const data = {
                unidadeID: loggedUnity.unidadeID,
                cnpj: cnpj,
                destinatario: email
            }
            api.post(`${currentLink}/sendMail`, { data })
                .then(response => {
                    toast.success('E-mail enviado com sucesso')
                })
                .catch(error => {
                    console.error('Erro ao enviar email', error)
                })
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
        getList()
    }, [loadingSave])

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
            title: 'CNPJ',
            field: 'cnpj',
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
                openModal={open}
                handleClose={() => setOpen(false)}
                makeFornecedor={makeFornecedor}
                loadingSave={loadingSave}
            />
        </>
    )
}

export default Fornecedor

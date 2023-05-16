import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import TableFilter from 'src/views/table/data-grid/TableFilter'
import { CardContent } from '@mui/material'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import DialogNewFornecedor from 'src/components/Defaults/Dialogs/DialogNewFornecedor'

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

    const openModal = () => {
        setOpen(true)
    }

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
        getList()
    }, [])

    const arrColumns = [
        {
            title: 'ID',
            field: 'id',
            size: 0.1
        },
        {
            title: 'Fantasia',
            field: 'nome',
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
                                    btnNew: true,
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
                // handleSubmit={() => envia()}
                btnCancel
                btnConfirm
            />
        </>
    )
}

export default Fornecedor

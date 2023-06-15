import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import TableFilter from 'src/views/table/data-grid/TableFilter'
import { CardContent } from '@mui/material'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'

import Loading from 'src/components/Loading'

// ** Next
import { useRouter } from 'next/router'

// ** Configs
import { configColumns } from 'src/configs/defaultConfigs'
import { Card } from '@mui/material'

// import axios from 'axios'

const RecebimentoMp = () => {
    const { user, loggedUnity } = useContext(AuthContext)
    const [result, setResult] = useState(null)
    const router = useRouter()
    const currentLink = router.pathname
    const { setTitle } = useContext(ParametersContext)

    const getList = async () => {
        await api.get(`${currentLink}/getList/${loggedUnity.unidadeID}`).then(response => {
            setResult(response.data)
            setTitle('Recebimento de MP')
        })
    }

    useEffect(() => {
        getList()
    }, [])

    const arrColumns = [
        {
            headerName: 'ID',
            field: 'id',
            size: 0.1
        },
        {
            headerName: 'Data',
            field: 'data',
            size: 0.1
        },
        {
            headerName: 'Fornecedor',
            field: 'fornecedor',
            size: 0.2
        },
        {
            headerName: 'CNPJ Fornecedor',
            field: 'cnpj',
            size: 0.3
        },
        {
            headerName: 'Total de Produtos',
            field: 'totalProdutos',
            size: 0.2
        },
        {
            headerName: 'Status',
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
                                    btnPrint: true
                                }}
                            />
                        </CardContent>
                    </Card>
                </>
            )}
        </>
    )
}

export default RecebimentoMp

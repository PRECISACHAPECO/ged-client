import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import Table from 'src/components/Defaults/Table'
import FormRecebimentoMp from 'src/components/RecebimentoMp/FormRecebimentoMp'
import { ParametersContext } from 'src/context/ParametersContext'
import { RouteContext } from 'src/context/RouteContext'
import { AuthContext } from 'src/context/AuthContext'

import Loading from 'src/components/Loading'

// ** Next
import { useRouter } from 'next/router'

// ** Configs
import { configColumns } from 'src/configs/defaultConfigs'

const RecebimentoMp = () => {
    const { user, loggedUnity } = useContext(AuthContext)
    const [result, setResult] = useState(null)
    const router = useRouter()
    const currentLink = router.pathname
    const { setTitle } = useContext(ParametersContext)
    const { id } = useContext(RouteContext)

    const getList = async () => {
        await api.get(`${currentLink}/getList/${loggedUnity.unidadeID}`).then(response => {
            setResult(response.data)
            setTitle('Recebimento de MP')
        })
    }

    useEffect(() => {
        getList()
    }, [id])

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
            {/* Exibe loading enquanto não existe result */}
            {!result ? (
                <Loading />
            ) : //? Se tem id, exibe o formulário
            id && id > 0 ? (
                <FormRecebimentoMp id={id} />
            ) : (
                //? Lista tabela de resultados da listagem
                <Table result={result} columns={columns} />
            )}
        </>
    )
}

export default RecebimentoMp

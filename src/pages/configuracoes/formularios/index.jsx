import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import Table from 'src/components/Defaults/Table'
import { ParametersContext } from 'src/context/ParametersContext'
import { RouteContext } from 'src/context/RouteContext'
import FormParametrosFornecedor from 'src/components/Configuracoes/Formularios/Fornecedor/FormParametrosFornecedor'
import FormParametrosRecebimentoMp from 'src/components/Configuracoes/Formularios/RecebimentoMp/FormParametrosRecebimentoMp'
import Loading from 'src/components/Loading'

// ** Next
import { useRouter } from 'next/router'

// ** Configs
import { configColumns } from 'src/configs/defaultConfigs'

const ListParametrosFormularios = () => {
    const [result, setResult] = useState(null)
    const router = useRouter()
    const currentLink = router.pathname
    const { setTitle } = useContext(ParametersContext)
    const { id } = useContext(RouteContext)

    useEffect(() => {
        const getList = async () => {
            await api.get(currentLink).then(response => {
                setResult(response.data)
                setTitle('Formulários')
            })
        }
        getList()
    }, [id])

    const arrColumns = [
        {
            title: 'ID',
            field: 'id',
            size: 0.2
        },
        {
            title: 'Nome',
            field: 'nome',
            size: 0.8
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
                id == 1 ? (
                    <FormParametrosFornecedor id={id} />
                ) : id == 2 ? (
                    <FormParametrosRecebimentoMp id={id} />
                ) : (
                    <h3>Em desenvolvimento...</h3>
                )
            ) : (
                //? Lista tabela de resultados da listagem
                <Table result={result} columns={columns} />
            )}
        </>
    )
}

export default ListParametrosFormularios

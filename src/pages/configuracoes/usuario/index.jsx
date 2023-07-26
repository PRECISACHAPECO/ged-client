import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import Table from 'src/components/Defaults/Table'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'
import FormUsuario from 'src/components/Configuracoes/Usuario/FormUsuario'
import Loading from 'src/components/Loading'

// ** Next
import { useRouter } from 'next/router'

// ** Configs
import { configColumns } from 'src/configs/defaultConfigs'

const Usuario = () => {
    const [result, setResult] = useState(null)
    const router = useRouter()
    const currentLink = router.pathname
    const { setTitle, id } = useContext(ParametersContext)
    const { loggedUnity } = useContext(AuthContext)

    useEffect(() => {
        const getList = async () => {
            await api
                .get(`${currentLink}?unidadeID=${loggedUnity.unidadeID}&papelID=${loggedUnity.papelID}`)
                .then(response => {
                    setResult(response.data)
                    setTitle('Usuário')
                })
        }
        getList()
    }, [id])

    const arrColumns = [
        {
            title: 'ID',
            field: 'id',
            size: 0.1
        },
        {
            title: 'Nome',
            field: 'nome',
            size: 0.8
        },
        {
            title: 'Status',
            field: 'status',
            size: 0.1
        }
    ]

    const columns = configColumns(currentLink, arrColumns)

    return (
        <>
            {/* Exibe loading enquanto não existe result */}
            {!result ? (
                <Loading />
            ) : //? Se tem id, exibe o formulário
            id ? (
                <FormUsuario id={id} />
            ) : (
                //? Lista tabela de resultados da listagem
                <Table result={result} columns={columns} />
            )}
        </>
    )
}

export default Usuario

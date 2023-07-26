import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import Table from 'src/components/Defaults/Table'
import FormProdutos from 'src/components/Cadastros/Produtos/FormProdutos'
import { ParametersContext } from 'src/context/ParametersContext'
import { RouteContext } from 'src/context/RouteContext'
import { AuthContext } from 'src/context/AuthContext'

import Loading from 'src/components/Loading'

// ** Next
import { useRouter } from 'next/router'

// ** Configs
import { configColumns } from 'src/configs/defaultConfigs'
import { Card } from '@mui/material'

// import axios from 'axios'

const Produtos = () => {
    const [result, setResult] = useState(null)
    const router = useRouter()
    const currentLink = router.pathname
    const { setTitle } = useContext(ParametersContext)
    const { user, loggedUnity } = useContext(AuthContext)
    const { id } = useContext(RouteContext)

    const getList = async () => {
        await api.post(currentLink, { unidadeID: loggedUnity.unidadeID }).then(response => {
            setResult(response.data)
            setTitle('Produto')
        })
    }

    useEffect(() => {
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
            size: 0.6
        },
        {
            title: 'Unidade de Medida',
            field: 'unidadeMedida',
            size: 0.2
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
            id && id > 0 ? (
                <FormProdutos id={id} />
            ) : (
                //? Lista tabela de resultados da listagem
                <Table result={result} columns={columns} />
            )}
        </>
    )
}

Produtos.acl = {
    action: 'read',
    subject: 'acl-page'
}

export default Produtos

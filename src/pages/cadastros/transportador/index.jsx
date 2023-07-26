import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import FormTransportador from 'src/components/Cadastros/Transportador/FormTransportador'
import Table from 'src/components/Defaults/Table'
import { RouteContext } from 'src/context/RouteContext'
import { ParametersContext } from 'src/context/ParametersContext'
import { AuthContext } from 'src/context/AuthContext'

import Loading from 'src/components/Loading'

// ** Next
import { useRouter } from 'next/router'

// ** Configs
import { configColumns } from 'src/configs/defaultConfigs'
import { Card } from '@mui/material'

// import axios from 'axios'

const Transportador = () => {
    const [result, setResult] = useState(null)
    const router = useRouter()
    const { id } = useContext(RouteContext)
    const currentLink = router.pathname
    const { setTitle } = useContext(ParametersContext)
    const { user, loggedUnity } = useContext(AuthContext)

    const getList = async () => {
        await api.post(currentLink, { unidadeID: loggedUnity.unidadeID }).then(response => {
            setResult(response.data)
            setTitle('Transportador')
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
            id && id > 0 ? (
                <FormTransportador id={id} />
            ) : (
                //? Lista tabela de resultados da listagem
                <Table result={result} columns={columns} />
            )}
        </>
    )
}

export default Transportador

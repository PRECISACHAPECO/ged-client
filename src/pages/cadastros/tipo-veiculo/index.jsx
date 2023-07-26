import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import Table from 'src/components/Defaults/Table'
import { CardContent } from '@mui/material'
import FormTipoVeiculo from 'src/components/Cadastros/TipoVeiculo/FormTipoVeiculo'
import { ParametersContext } from 'src/context/ParametersContext'
import { RouteContext } from 'src/context/RouteContext'

import Loading from 'src/components/Loading'

// ** Next
import { useRouter } from 'next/router'

// ** Configs
import { configColumns } from 'src/configs/defaultConfigs'
import { Card } from '@mui/material'

// import axios from 'axios'

const TipoVeiculo = () => {
    const [result, setResult] = useState(null)
    const router = useRouter()
    const currentLink = router.pathname
    const { setTitle } = useContext(ParametersContext)
    const { id } = useContext(RouteContext)

    const getList = async () => {
        await api.get(currentLink).then(response => {
            setResult(response.data)
            setTitle('Tipo de Veículo')
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
                <FormTipoVeiculo id={id} />
            ) : (
                //? Lista tabela de resultados da listagem
                <Table result={result} columns={columns} />
            )}
        </>
    )
}

export default TipoVeiculo

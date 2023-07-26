import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import Table from 'src/components/Defaults/Table'
import { CardContent } from '@mui/material'
import { ParametersContext } from 'src/context/ParametersContext'
import { RouteContext } from 'src/context/RouteContext'
import FormGrupoAnexos from 'src/components/Cadastros/grupoAnexos/FormGrupoAnexos'

import Loading from 'src/components/Loading'

// ** Next
import { useRouter } from 'next/router'

// ** Configs
import { configColumns } from 'src/configs/defaultConfigs'
import { Card } from '@mui/material'

// import axios from 'axios'

const GrupoAnexos = () => {
    const [result, setResult] = useState(null)
    const router = useRouter()
    const currentLink = router.pathname
    const { setTitle } = useContext(ParametersContext)
    const { id } = useContext(RouteContext)

    const getList = async () => {
        await api.get(currentLink).then(response => {
            setResult(response.data)
            console.log('ta vindo', response.data)
            setTitle('Requisitos de anexos')
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
            headerName: 'Nome',
            field: 'nome',
            size: 0.6
        },
        {
            headerName: 'Descrição',
            field: 'descricao',
            size: 0.6
        },
        {
            headerName: 'Status',
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
                <FormGrupoAnexos id={id} />
            ) : (
                //? Lista tabela de resultados da listagem
                <Table result={result} columns={columns} />
            )}
        </>
    )
}

GrupoAnexos.acl = {
    action: 'read',
    subject: 'acl-page'
}

export default GrupoAnexos

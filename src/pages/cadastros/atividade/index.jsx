import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import Table from 'src/components/Defaults/Table'
import { Box, Button, CardContent } from '@mui/material'
import { ParametersContext } from 'src/context/ParametersContext'

import FormAtividade from 'src/components/Cadastros/Atividade/FormAtividade'

import Loading from 'src/components/Loading'

// ** Next
import { useRouter } from 'next/router'

// ** Configs
import { configColumns } from 'src/configs/defaultConfigs'
import { Card } from '@mui/material'

// import axios from 'axios'

const Atividade = () => {
    const [result, setResult] = useState(null)
    const router = useRouter()
    const currentLink = router.pathname
    const { setTitle, id } = useContext(ParametersContext)

    useEffect(() => {
        const getList = async () => {
            await api.get(currentLink).then(response => {
                console.log('🚀 ~ response.data:', response.data)
                setResult(response.data)
                setTitle('Atividade')
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

    return <>{id && id > 0 ? <FormAtividade id={id} /> : result && <Table result={result} columns={columns} />}</>
}

export default Atividade

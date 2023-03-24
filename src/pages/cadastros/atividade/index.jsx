import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import TableFilter from 'src/views/table/data-grid/TableFilter'
import { CardContent, CardHeader } from '@mui/material'

import Loading from 'src/components/Loading'

// ** Next
import { useRouter } from 'next/router'

// ** Configs
import { configColumns } from 'src/configs/defaultConfigs'
import { Button, Card } from '@mui/material'
import Link from 'next/link'
import ListHeader from 'src/components/ListHeader'

// import axios from 'axios'

const Atividade = () => {
    const [result, setResult] = useState(null)
    const router = useRouter()
    const currentLink = router.pathname

    useEffect(() => {
        const getList = async () => {
            await api.get(currentLink).then(response => {
                setResult(response.data)
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
            <h2>Atividade</h2>
            {!result && <Loading />}
            {result && (
                <>
                    <Card>
                        <CardContent>
                            {/* <ListHeader btnNew btnPrint /> */}
                            <TableFilter
                                title='Atividades List Updated'
                                rows={result}
                                columns={columns}
                                buttonsHeader={{
                                    btnNew: true,
                                    btnPrint: false,
                                }}
                            />
                        </CardContent>
                    </Card>
                </>
            )}
        </>
    )
}

export default Atividade

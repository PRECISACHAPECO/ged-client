import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import TableFilter from 'src/views/table/data-grid/TableFilter'
import { CardContent, CardHeader } from '@mui/material'

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
            <Card>
                <CardContent>
                    <ListHeader btnNew btnPrint />
                    {result && <TableFilter title='Atividades List Updated' rows={result} columns={columns} />}
                    <Link href={`${router.pathname}/novo/`}>
                        <Button variant='contained' color='primary'>
                            Novo
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </>
    )
}

export default Atividade

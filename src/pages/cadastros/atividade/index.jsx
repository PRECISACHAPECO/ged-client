import { useEffect, useState, useContext } from 'react'
import { api } from 'src/configs/api'
import { Button, TextField, Divider } from '@mui/material'
import TableFilter from 'src/views/table/data-grid/TableFilter'

import { AuthContext } from 'src/context/AuthContext'

// ** Next
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** Configs
import { configColumns } from 'src/configs/defaultConfigs'

const Atividade = () => {
    const [result, setResult] = useState([])
    const [description, setDescription] = useState('')
    const [refresh, setRefresh] = useState(false)

    const router = useRouter()

    const { statusDefault } = useContext(AuthContext)
    const currentLink = router.pathname

    const rows = [
        {
            id: 1,
            nome: 'John Doe',
            email: 'jpomnas@gmail',
            start_date: '2021-01-01',
            salary: '1000',
            age: '10',
            status: 1,
            avatar: 'avatar-s-1.png'
        },
        {
            id: 2,
            nome: 'maria',
            email: 'jpomnas@gmail',
            start_date: '2021-01-01',
            salary: '200',
            age: '30',
            status: 0,
            avatar: 'avatar-s-2.png'
        },
        {
            id: 3,
            nome: 'Joao',
            email: 'jpomnas@gmail',
            start_date: '2021-01-01',
            salary: '10',
            age: '60',
            status: 1,
            avatar: 'avatar-s-1.png'
        },
        {
            id: 4,
            nome: 'Rodrigo',
            email: 'jpomnas@gmail',
            start_date: '2021-01-01',
            salary: '10000',
            age: '90',
            status: 0,
            avatar: 'avatar-s-2.png'
        }
    ]

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

    useEffect(() => {
        const getList = async () => {
            await api.get('atividade/').then(response => {
                setResult(response.data)
            })
        }
        getList()
    }, [refresh])

    const handleSubmit = async e => {
        e.preventDefault()
        await api.post('atividade/', { description }).then(response => {
            setDescription('')
            setRefresh(!refresh)
        })
    }

    const remove = async id => {
        await api.delete(`atividade/${id}`).then(response => {
            setRefresh(!refresh)
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <TextField
                    name='description'
                    label='Descrição'
                    placeholder='Descrição'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />

                <div>
                    <Button disabled={!description} type='submit' variant='contained' sx={{ my: 2 }}>
                        Inserir
                    </Button>
                </div>
            </form>
            <Divider />
            <table>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Descrição</td>
                        <td>Ação</td>
                    </tr>
                </thead>
                <tbody>
                    {result &&
                        result.map((row, i) => (
                            <tr key={i}>
                                <td>{row.registerID}</td>
                                <td>{row.description}</td>
                                <td>
                                    <Button variant='outlined' color='error' onClick={e => remove(row.registerID)}>
                                        Remover
                                    </Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <TableFilter title='Atividades' rows={rows} columns={columns} />
        </>
    )
}

export default Atividade

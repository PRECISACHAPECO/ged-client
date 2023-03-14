import { useEffect, useState } from 'react'
import { api } from 'src/configs/api'
import { Button, TextField, Divider } from '@mui/material'

const Atividade = () => {
    const [result, setResult] = useState([])
    const [description, setDescription] = useState('')
    const [refresh, setRefresh] = useState(false)

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
        </>
    )
}

export default Atividade

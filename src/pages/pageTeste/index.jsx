import { Button, Container, FormControl, TextField, Grid, Modal } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { useState, useEffect } from 'react'
import { api } from 'src/configs/api'
import Box from '@mui/material/Box'

const PageTest = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [users, setUsers] = useState([])
    const [isRegistered, setIsRegistered] = useState(false)
    const [open, setOpen] = useState(false)

    async function handleClickSubmit() {
        try {
            const response = await api.post('register', { name })
            console.log(response.data.message)
            setIsRegistered(true)
            setTimeout(() => {
                setIsRegistered(false)
            }, 1)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDelete(id) {
        try {
            const response = await api.delete(`register/${id}`)
            console.log('Deletado com sucesso')
            setIsRegistered(true)
            setTimeout(() => {
                setIsRegistered(false)
            }, 1)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDeleteAll() {
        try {
            const response = await api.delete('register')
            console.log('Deletado com sucesso')
            setIsRegistered(true)
            setTimeout(() => {
                setIsRegistered(false)
            }, 1)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        async function getUsers() {
            try {
                const response = await api.get('register')
                console.log(response.data)
                setUsers(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        getUsers()
    }, [isRegistered])

    function handleOpen() {
        setOpen(true)
    }

    function handleClose() {
        setOpen(false)
    }

    return (
        <Grid2 container spacing={4} xs={12}>
            <Grid xs={6}>
                <Container>
                    <FormControl>
                        <TextField
                            id='name'
                            name='name'
                            label='Nome'
                            value={name}
                            variant='outlined'
                            onChange={e => setName(e.target.value)}
                        />
                        <TextField
                            id='email'
                            name='email'
                            label='E-mail'
                            variant='outlined'
                            value={email}
                            required
                            onChange={e => setEmail(e.target.value)}
                        />
                        <TextField
                            id='password'
                            password='password'
                            value={password}
                            label='Senha'
                            variant='outlined'
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Button type='submit' variant='contained' color='primary' onClick={handleClickSubmit}>
                            Enviar
                        </Button>
                    </FormControl>
                </Container>
            </Grid>
            <Grid xs={6}>
                <h1>Listagem</h1>
                {users.map(user => (
                    <Container key={user.id} style={{ display: 'flex', gap: '2rem' }}>
                        <p>{user.name}</p>
                        <Button variant='outlined' color={'error'} onClick={() => handleDelete(user.id)}>
                            Deletar
                        </Button>
                    </Container>
                ))}
            </Grid>
            <Grid xs={12}>
                <Button variant='contained' color='error' onClick={handleDeleteAll}>
                    Limpar Todos
                </Button>
            </Grid>
            <Grid>
                <Button onClick={handleOpen}>Open modal</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby='parent-modal-title'
                    aria-describedby='parent-modal-description'
                >
                    <Box sx={{ position: 'absolute', left: '50%', border: '4px solid red', width: '400px' }}>
                        <h2 id='parent-modal-title'>Text in a modal</h2>
                        <p id='parent-modal-description'>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </p>
                    </Box>
                </Modal>
            </Grid>
        </Grid2>
    )
}

export default PageTest

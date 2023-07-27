import Router from 'next/router'

import { CardContent, Button, Box } from '@mui/material'
import Link from 'next/link'
import { AuthContext } from 'src/context/AuthContext'
import { useContext } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const ListHeader = ({ btnNew, btnPrint }) => {
    const router = Router
    const { routes } = useContext(AuthContext)

    return (
        <>
            <CardContent sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', p: '0', m: '0' }}>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                    {btnPrint && (
                        <Button
                            onClick={() => window.print()}
                            type='button'
                            variant='outlined'
                            color='primary'
                            size='medium'
                            startIcon={<Icon icon='mdi:printer' />}
                        >
                            Imprimir
                        </Button>
                    )}

                    {btnNew && routes.find(route => route.rota === router.pathname && route.inserir) && (
                        <Link href={`${router.pathname}/novo`}>
                            <Button
                                type='button'
                                variant='outlined'
                                color='primary'
                                size='medium'
                                startIcon={<Icon icon='ic:outline-plus' />}
                            >
                                Novo
                            </Button>
                        </Link>
                    )}
                </Box>
            </CardContent>
        </>
    )
}

export default ListHeader

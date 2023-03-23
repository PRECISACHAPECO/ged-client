import Router from 'next/router'

import { CardContent, Button, Box } from '@mui/material'
import Link from 'next/link'

const ListHeader = ({ btnNew, btnPrint }) => {
    const router = Router

    return (
        <>
            <CardContent sx={{ display: 'flex', justifyContent: 'end' }}>
                <Box>
                    {btnPrint && (
                        <Button
                            onClick={() => window.print()}
                            type='button'
                            variant='outlined'
                            color='primary'
                            size='medium'
                            sx={{ mt: 2, mr: 2, py: 2 }}
                        >
                            Imprimir
                        </Button>
                    )}

                    {btnNew && (
                        <Link href={`${router.pathname}/novo`}>
                            <Button
                                type='button'
                                variant='outlined'
                                color='primary'
                                size='medium'
                                sx={{ mt: 2, mr: 2, py: 2 }}
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

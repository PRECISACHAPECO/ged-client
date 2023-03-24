import Router from 'next/router'

import { CardContent, Button, Box } from '@mui/material'
import Link from 'next/link'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const ListHeader = ({ btnNew, btnPrint }) => {
    const router = Router

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

                    {btnNew && (
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

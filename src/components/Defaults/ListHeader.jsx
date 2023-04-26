import Router from 'next/router'

import { CardContent, Button, Box } from '@mui/material'
import Link from 'next/link'
import { buildAbilityFor } from 'src/configs/acl'
import { AuthContext } from 'src/context/AuthContext'
import { useContext } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const ListHeader = ({ btnNew, btnPrint }) => {
    const router = Router
    const { user } = useContext(AuthContext)

    const clientAbility = buildAbilityFor(user.role, 'acl-page')
    const clientPermissions = clientAbility.rules

    console.log('Permissões do usuário client:', clientPermissions)

    console.log(
        'aaa',
        clientPermissions.map(item => item.action)
    )

    return (
        <>
            <CardContent sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', p: '0', m: '0' }}>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                    {clientPermissions.map(item => {
                        if (item.action.includes('manage') || item.action.includes('read')) {
                            return (
                                btnPrint && (
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
                                )
                            )
                        }
                        return null
                    })}

                    {clientPermissions.map(item => {
                        if (item.action.includes('manage')) {
                            return (
                                btnNew && (
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
                                )
                            )
                        }
                        return null
                    })}
                </Box>
            </CardContent>
        </>
    )
}

export default ListHeader

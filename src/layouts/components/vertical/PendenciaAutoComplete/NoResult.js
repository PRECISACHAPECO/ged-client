

import { Box, List, ListItem, Typography } from '@material-ui/core'
import { Icon } from '@iconify/react'
import Link from 'next/link'


const NoResult = ({ value, setOpenDialog }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ mb: 2.5, color: 'text.primary' }}>
                <Icon icon='mdi:file-remove-outline' fontSize='5rem' />
            </Box>
            <Typography variant='h6' sx={{ mb: 11.5, wordWrap: 'break-word' }}>
                Nenhum resultado encontrado para {' '}
                <Typography variant='h6' component='span' sx={{ wordWrap: 'break-word' }}>
                    {`"${value}"`}
                </Typography>
            </Typography>

            <Typography variant='body2' sx={{ mb: 2.5, color: 'text.disabled' }}>
                Tente pesquisar por
            </Typography>
            <List sx={{ py: 0 }}>
                <ListItem sx={{ py: 2 }} disablePadding onClick={() => setOpenDialog(false)}>
                    <Box
                        component={Link}
                        href='/dashboards/crm'
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            '&:hover > *': { color: 'primary.main' }
                        }}
                    >
                        <Box sx={{ mr: 2.5, display: 'flex', color: 'text.primary' }}>
                            <Icon icon='mdi:cart-outline' fontSize={20} />
                        </Box>
                        <Typography variant='body2' sx={{ color: 'text.primary' }}>
                            CRM Dashboard
                        </Typography>
                    </Box>
                </ListItem>
                <ListItem sx={{ py: 2 }} disablePadding onClick={() => setOpenDialog(false)}>
                    <Box
                        component={Link}
                        href='/pages/user-profile/profile'
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            '&:hover > *': { color: 'primary.main' }
                        }}
                    >
                        <Box sx={{ mr: 2.5, display: 'flex', color: 'text.primary' }}>
                            <Icon icon='mdi:account-outline' fontSize={20} />
                        </Box>
                        <Typography variant='body2' sx={{ color: 'text.primary' }}>
                            User Profile
                        </Typography>
                    </Box>
                </ListItem>
                <ListItem sx={{ py: 2 }} disablePadding onClick={() => setOpenDialog(false)}>
                    <Box
                        component={Link}
                        href='/pages/account-settings/account'
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            '&:hover > *': { color: 'primary.main' }
                        }}
                    >
                        <Box sx={{ mr: 2.5, display: 'flex', color: 'text.primary' }}>
                            <Icon icon='mdi:account-cog-outline' fontSize={20} />
                        </Box>
                        <Typography variant='body2' sx={{ color: 'text.primary' }}>
                            Account Settings
                        </Typography>
                    </Box>
                </ListItem>
            </List>
        </Box>
    )
}

export default NoResult
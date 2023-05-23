
import { Box, Grid, List, ListItem, Typography } from '@mui/material'
import SuggestionsData from './data'
import Link from 'next/link'
import { Icon } from '@iconify/react'


const DefaultSuggestions = ({ setOpenDialog }) => {
    const defaultSuggestionsData = SuggestionsData()

    return (
        <Grid container spacing={6} sx={{ ml: 0 }}>
            {defaultSuggestionsData.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                    <Typography component='p' variant='overline' sx={{ lineHeight: 1.25, color: 'text.disabled' }}>
                        {item.category}
                    </Typography>
                    <List sx={{ py: 2.5 }}>
                        {item.suggestions.map((suggestionItem, index2) => (
                            <ListItem key={index2} sx={{ py: 2 }} disablePadding>
                                <Box
                                    component={Link}
                                    href={suggestionItem.link}
                                    onClick={() => setOpenDialog(false)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        '& svg': { mr: 2.5 },
                                        color: 'text.primary',
                                        textDecoration: 'none',
                                        '&:hover > *': { color: 'primary.main' }
                                    }}
                                >
                                    <Icon icon={suggestionItem.icon} fontSize={20} />
                                    <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                        {suggestionItem.suggestion}
                                    </Typography>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            ))}
        </Grid>
    )
}

export default DefaultSuggestions
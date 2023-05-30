// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
    // ** Var
    const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'end' }} className='no-print'>
            <Typography sx={{ mr: 2 }}>
                {`© ${new Date().getFullYear()}, por `}
                <Link target='_blank' href='https://sisprecisa.com.br/'>
                    Precisa Tecnologia
                </Link>
            </Typography>
        </Box>
    )
}

export default FooterContent

import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const Loading = ({ title }) => {
    return (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', textAlign: 'center' }}>
            <CircularProgress />
            <p>{title ?? 'Carregando...'}</p>
        </Box>
    )
}

export default Loading

import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const Loading = () => {
    return (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%' }}>
            <CircularProgress />
        </Box>
    )
}

export default Loading
